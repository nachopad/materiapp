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
                <Badge className="bg-orange-500">{career.approved} Aprobadas</Badge>
                <Badge className="bg-yellow-500 text-yellow-950">{career.regular} Cursando</Badge>
                <Badge variant="secondary">{career.pending} Pendientes</Badge>
                <Badge className="bg-blue-500">{career.average} Promedio</Badge>
                <Badge variant="secondary" title="Porcentaje">
                    {career.progress}%
                </Badge>
            </div>
            <Progress value={career.progress} className="h-3 bg-secondary" classNameIndicator="bg-orange-500" />
        </section>
    );
}
