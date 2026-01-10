import { Progress } from '@/shared/components/ui/progress';
import type { CareerProgress } from '../types';
import { Badge } from '@/shared/components/ui/badge';

interface CareerProgressCardProps {
    career: CareerProgress;
}

/**
 * Card displaying career progress with colored progress bar.
 */
export function CareerProgressCard({ career }: CareerProgressCardProps) {
    return (
        <article className="space-y-2">
            <hgroup className="flex items-center gap-2">
                <Badge variant="secondary">{career.percentage}%</Badge>
                <h1 className="text-base font-medium">{career.name}</h1>
            </hgroup>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    {career.approved} Aprobadas
                </span>
                {/* <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" aria-hidden="true" />
                    {career.regular} Regulares
                </span> */}
                <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
                    {career.pending} Pendientes
                </span>
            </div>

            <Progress value={career.percentage} className="h-3 bg-secondary" classNameIndicator="bg-emerald-500" />
        </article>
    );
}
