import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { Google } from '@/assets/icons';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { TextDivider } from '@/shared/components/text-divider';

import { AuthMobileHeader } from './auth-mobile-header';
import { registerSchema, type RegisterFormValues } from '../schemas/register-form.schema';

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log(data);
            setIsLoading(false);
        }, 1000);
    }

    return (
        <section className="w-full space-y-6">
            <header className="space-y-2 text-center">
                <AuthMobileHeader />
                <hgroup>
                    <h2 className="text-xl font-semibold text-primary">Crea tu cuenta</h2>
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-primary hover:underline">
                            Iniciar Sesión
                        </Link>
                    </p>
                </hgroup>
            </header>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input icon={User} placeholder="Full Name" autoComplete="name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input icon={Mail} placeholder="Email" autoComplete="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        icon={Lock}
                                        type="password"
                                        placeholder="Password"
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
                                <FormControl>
                                    <Input
                                        icon={Lock}
                                        type="password"
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" fullWidth loading={isLoading}>
                        Create an account
                    </Button>
                </form>
            </Form>

            <TextDivider />
            <Button variant="outline" icon={<Google />} fullWidth>
                Register with Google
            </Button>
        </section>
    );
}
