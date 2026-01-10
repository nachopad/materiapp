import { CareerProgressCard } from './career-progress-card';
import type { CareerProgress } from '../types';

interface ProgressSectionProps {
    careers: CareerProgress[];
}

/**
 * Section displaying all career progress.
 */
export function ProgressSection({ careers }: ProgressSectionProps) {
    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold tracking-normal">Progreso</h1>

            {careers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tienes carreras registradas.</p>
            ) : (
                <div className="space-y-6">
                    {careers.map((career) => (
                        <CareerProgressCard key={career.id} career={career} />
                    ))}
                </div>
            )}
        </section>
    );
}
