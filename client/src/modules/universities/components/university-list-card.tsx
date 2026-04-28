import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

interface UniversityListCardProps {
    name: string;
    careersCount: number;
}

/**
 * Get initials from university name (up to 2 characters).
 */
function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Card component displaying a single university with name and careers count.
 */
export function UniversityListCard({ name, careersCount }: UniversityListCardProps) {
    return (
        <article className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 overflow-hidden">
            <header className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 overflow-hidden">
                    <h2 className="text-base font-semibold truncate">{name}</h2>
                </div>
                <Badge variant="outline" className="shrink-0">
                    {careersCount} {careersCount === 1 ? 'carrera' : 'carreras'}
                </Badge>
            </header>
        </article>
    );
}
