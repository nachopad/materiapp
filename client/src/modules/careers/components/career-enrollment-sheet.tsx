"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/shared/components/ui/sheet';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';
import {
    enrollmentSchema,
    type EnrollmentFormValues,
} from '../schemas/enrollment-form.schema';
import type { EnrollmentDate } from '../types';

interface CareerEnrollmentSheetProps {
    careerId: string;
    careerName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Enrollment bottom sheet with exclusive date mode toggle.
 * Supports fullDate (YYYY-MM-DD) OR monthYear (YYYY-MM) inputs.
 * Uses shared schema module for consistent validation across entry points.
 */
export function CareerEnrollmentSheet({
    careerId,
    careerName,
    open,
    onOpenChange,
}: CareerEnrollmentSheetProps) {
    const enroll = useEnrollmentsStore((state) => state.enroll);
    const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

    const form = useForm<EnrollmentFormValues>({
        resolver: zodResolver(enrollmentSchema),
        mode: 'onBlur',
        defaultValues: {
            dateMode: 'fullDate',
            fullDate: '',
            monthYear: '',
        },
    });

    const { dateMode } = form.watch();

    // Focus trap and aria-modal handling
    useEffect(() => {
        if (open) {
            setPreviousFocus(document.activeElement as HTMLElement);
            // Focus the first field after animation
            const timer = setTimeout(() => {
                if (dateMode === 'fullDate') {
                    document.getElementById('fullDate')?.focus();
                } else {
                    document.getElementById('monthYear')?.focus();
                }
            }, 100);
            return () => clearTimeout(timer);
        } else {
            // Restore focus when closing
            previousFocus?.focus();
        }
    }, [open, dateMode, previousFocus]);

    const onSubmit = (data: EnrollmentFormValues) => {
        let enrollmentDate: EnrollmentDate;

        if (data.dateMode === 'fullDate' && data.fullDate) {
            enrollmentDate = { mode: 'fullDate', value: data.fullDate };
        } else if (data.dateMode === 'monthYear' && data.monthYear) {
            enrollmentDate = { mode: 'monthYear', value: data.monthYear };
        } else {
            return; // Should not happen due to validation
        }

        enroll(careerId, enrollmentDate);
        onOpenChange(false);
    };

    // Escape is handled automatically by Radix Dialog via onOpenChange
    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
            aria-modal="true"
        >
            <SheetContent side="bottom" className="w-full max-w-md mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <SheetHeader>
                            <SheetTitle>Inscribirse en {careerName}</SheetTitle>
                            <SheetDescription>
                                Completá la siguiente información para realizar tu inscripción.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="px-4 py-6 space-y-6">
                            {/* Date mode toggle */}
                            <FormField
                                control={form.control}
                                name="dateMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">¿Cuándo te inscribiste?</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2" role="radiogroup" aria-label="Modo de fecha">
                                                <label
                                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                                                        field.value === 'fullDate'
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:bg-accent'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value="fullDate"
                                                        checked={field.value === 'fullDate'}
                                                        onChange={() => field.onChange('fullDate')}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-sm font-medium">Fecha completa</span>
                                                </label>
                                                <label
                                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                                                        field.value === 'monthYear'
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:bg-accent'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value="monthYear"
                                                        checked={field.value === 'monthYear'}
                                                        onChange={() => field.onChange('monthYear')}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-sm font-medium">Mes/Año</span>
                                                </label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Date input - conditional based on mode */}
                            <div className="space-y-2">
                                {dateMode === 'fullDate' ? (
                                    <FormField
                                        control={form.control}
                                        name="fullDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="fullDate" className="text-sm font-medium">
                                                    Fecha de inscripción
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="fullDate"
                                                        type="date"
                                                        {...field}
                                                        className="mt-1.5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="monthYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="monthYear" className="text-sm font-medium">
                                                    Mes y año de inscripción
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="monthYear"
                                                        type="month"
                                                        {...field}
                                                        className="mt-1.5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={!form.formState.isValid}>
                                Confirmar inscripción
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}