import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas';

interface ChangePasswordFormProps {
    onSubmit: (data: ChangePasswordFormValues) => Promise<void>;
}

/**
 * Form for changing user password.
 */
export function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function handleSubmit(data: ChangePasswordFormValues) {
        setIsLoading(true);
        try {
            await onSubmit(data);
            form.reset();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-bold tracking-normal">Cambiar contraseña</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña actual</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nueva contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar contraseña</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="outline" fullWidth loading={isLoading} icon={<Lock />}>
                        Cambiar contraseña
                    </Button>
                </form>
            </Form>
        </section>
    );
}
