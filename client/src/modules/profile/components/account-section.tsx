import { Google } from '@/assets/icons';
import { Button } from '@/shared/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router';
import type { AccountProvider } from '../types';

interface AccountSectionProps {
    providers: AccountProvider[];
    onChangePassword: () => void;
    onLinkGoogle: () => void;
}

/**
 * Account section with linked providers and action buttons.
 */
export function AccountSection({ providers, onChangePassword, onLinkGoogle }: AccountSectionProps) {
    const googleProvider = providers.find((p) => p.provider === 'google');

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold tracking-normal">Cuenta</h1>

            {/* Google Provider Card */}
            <article className="flex items-center gap-4 rounded-lg border dark:border-border/25 bg-transparent p-4">
                <Google className="size-8" />
                <hgroup className="flex-1">
                    <h1 className="text-base font-medium">Google</h1>
                    <p className="text-sm text-muted-foreground">
                        {googleProvider?.isLinked ? (
                            'La cuenta ha sido vinculada con Google'
                        ) : (
                            <button
                                type="button"
                                className="font-medium text-blue-500 dark:text-blue-400 hover:underline"
                                onClick={onLinkGoogle}
                            >
                                Vincular cuenta de Google
                            </button>
                        )}
                    </p>
                </hgroup>
            </article>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
                <Link to="/profile/edit">
                    <Button
                        variant="outline"
                        className="dark:bg-transparent dark:border-border/25"
                        fullWidth
                        onClick={onChangePassword}
                        icon={<Lock />}
                    >
                        Cambiar contraseña
                    </Button>
                </Link>
            </div>
        </section>
    );
}
