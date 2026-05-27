import { Edit2 } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/shared/components/ui/button';
import { TooltipComponent } from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

import type { UserProfile } from '../types';

interface ProfileHeaderProps {
    user: UserProfile;
    className?: string;
}

/**
 * Profile header displaying user avatar, name, email and join date.
 */
export function ProfileHeader({ user, className }: ProfileHeaderProps) {
    const formattedJoinDate = new Date(user.joinedAt).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <header className={cn('', className)}>
            <div className="space-y-1">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-wrap min-w-0">{user.fullName}</h1>
                    <TooltipComponent text="Editar datos">
                        <Link to="/profile/edit">
                            <Button
                                variant="outline"
                                icon={<Edit2 />}
                                size="icon-sm"
                                className="dark:bg-transparent dark:border-border/25"
                            />
                        </Link>
                    </TooltipComponent>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm font-semibold text-foreground/80 ">Se unió en {formattedJoinDate}</p>
            </div>
        </header>
    );
}
