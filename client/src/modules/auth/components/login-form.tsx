import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { Google } from '@/assets/icons';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { TextDivider } from '@/shared/components/text-divider';

import { AuthMobileHeader } from './auth-mobile-header';
import { loginSchema, type LoginFormValues } from '../schemas/login-form.schema';

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
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
                    <h2 className="text-lg font-semibold text-primary">¡Bienvenido!</h2>
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            Registrate
                        </Link>
                    </p>
                </hgroup>
            </header>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" fullWidth loading={isLoading} variant="default">
                        Iniciar Sesión
                    </Button>
                </form>
            </Form>

            <TextDivider />

            <Button variant="outline" icon={<Google />} fullWidth>
                Iniciar Sesión con Google
            </Button>
        </section>
    );
}
