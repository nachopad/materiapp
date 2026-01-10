import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { University } from '../types';

interface UniversityCardProps {
    university: University;
}

/**
 * Card displaying university information.
 */
export function UniversityCard({ university }: UniversityCardProps) {
    const formattedDate = new Date(university.enrollmentDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <article className="flex items-center gap-3 rounded-lg border dark:border-border/25 bg-transparent p-4">
            <Avatar className="h-10 w-10 bg-secondary">
                {university.logoUrl ? (
                    <AvatarImage src={university.logoUrl} alt={university.name} />
                ) : (
                    <AvatarFallback className="bg-secondary text-xs">
                        {university.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                )}
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate" aria-label={university.name} title={university.name}>
                    {university.name}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formattedDate}
                </p>
            </div>
        </article>
    );
}
