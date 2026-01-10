import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { personalInfoSchema, type PersonalInfoFormValues } from '../schemas';

interface PersonalInfoFormProps {
    defaultValues: PersonalInfoFormValues;
    onSubmit: (data: PersonalInfoFormValues) => Promise<void>;
}

/**
 * Form for editing personal information (name).
 */
export function PersonalInfoForm({ defaultValues, onSubmit }: PersonalInfoFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PersonalInfoFormValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues,
    });

    async function handleSubmit(data: PersonalInfoFormValues) {
        setIsLoading(true);
        try {
            await onSubmit(data);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold tracking-normal">Información personal</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tu nombre completo" autoComplete="name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="outline" fullWidth loading={isLoading} icon={<Save />}>
                        Guardar cambios
                    </Button>
                </form>
            </Form>
        </section>
    );
}
