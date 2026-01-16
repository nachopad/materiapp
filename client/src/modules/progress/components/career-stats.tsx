import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import type { Career } from '../types';

interface CareerStatsProps {
    career: Career;
}

/**
 * Statistics row with badges and progress bar.
 */
export function CareerStats({ career }: CareerStatsProps) {
    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-500">{career.approved} Aprobadas</Badge>
                <Badge className="bg-blue-500">{career.average} Promedio</Badge>
                <Badge variant="secondary">{career.progress}%</Badge>
                <Badge variant="secondary">{career.pending} Pendientes</Badge>
            </div>
            <Progress value={career.progress} className="h-3 bg-secondary" classNameIndicator="bg-emerald-500" />
        </section>
    );
}
