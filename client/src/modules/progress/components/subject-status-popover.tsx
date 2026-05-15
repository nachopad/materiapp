import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { subjectStatusSchema } from '../schemas';
import { SUBJECT_STATUS } from '../types';
import type { Subject, SubjectStatus } from '../types';
import { STATUS_LABELS } from '../utils';
import type { SubjectStatusUpdate } from '../utils';

type SubjectStatusFormData = {
    status: SubjectStatus;
    grade?: number;
};

interface SubjectStatusPopoverProps {
    subject: Subject;
    onSubjectChange: (update: SubjectStatusUpdate) => void;
    children: ReactNode;
}

export function SubjectStatusPopover({ subject, onSubjectChange, children }: SubjectStatusPopoverProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<SubjectStatusFormData>({
        resolver: zodResolver(subjectStatusSchema),
        defaultValues: getDefaultValues(subject),
    });

    const currentStatus = form.watch('status');

    function handleStatusChange(status: SubjectStatus) {
        console.log('handleStatusChange', status);
        if (status === SUBJECT_STATUS.APPROVED) {
            if (subject.status === SUBJECT_STATUS.APPROVED && subject.grade !== undefined) {
                form.reset({ status: SUBJECT_STATUS.APPROVED, grade: subject.grade });
            } else {
                form.reset({ status: SUBJECT_STATUS.APPROVED });
            }
        } else {
            form.reset({ status });
            form.unregister('grade');
        }
        console.log('after reset values:', form.getValues());
    }

    function handleSubmit(data: SubjectStatusFormData) {
        console.log('handleSubmit', data);
        const update: SubjectStatusUpdate =
            data.status === SUBJECT_STATUS.APPROVED && data.grade !== undefined
                ? { status: SUBJECT_STATUS.APPROVED, grade: data.grade }
                : { status: data.status, grade: undefined };

        onSubjectChange(update);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-[min(calc(100vw-2rem),22rem)] p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit, (errors) => { console.log('submit errors', errors, 'values', form.getValues()); })} className="flex flex-col gap-4">
                        <Tabs value={currentStatus} onValueChange={(status) => handleStatusChange(status as SubjectStatus)}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value={SUBJECT_STATUS.APPROVED}>{STATUS_LABELS[SUBJECT_STATUS.APPROVED]}</TabsTrigger>
                                <TabsTrigger value={SUBJECT_STATUS.REGULAR}>{STATUS_LABELS[SUBJECT_STATUS.REGULAR]}</TabsTrigger>
                                <TabsTrigger value={SUBJECT_STATUS.PENDING}>{STATUS_LABELS[SUBJECT_STATUS.PENDING]}</TabsTrigger>
                            </TabsList>

                            <TabsContent value={SUBJECT_STATUS.APPROVED} className="pt-2">
                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Nota (1-10)"
                                                    inputMode="decimal"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val === '' ? undefined : Number(val));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value={SUBJECT_STATUS.REGULAR} className="pt-2 text-sm text-muted-foreground">
                                Marcá esta materia como cursando.
                            </TabsContent>
                            <TabsContent value={SUBJECT_STATUS.PENDING} className="pt-2 text-sm text-muted-foreground">
                                Dejá esta materia como pendiente.
                            </TabsContent>
                        </Tabs>

                        <Button type="submit" icon={<Save />} iconPosition="left" fullWidth>
                            Guardar
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}

function getDefaultValues(subject: Subject): SubjectStatusFormData {
    if (subject.status === SUBJECT_STATUS.APPROVED && subject.grade !== undefined) {
        return { status: SUBJECT_STATUS.APPROVED, grade: subject.grade };
    }
    return { status: subject.status };
}
