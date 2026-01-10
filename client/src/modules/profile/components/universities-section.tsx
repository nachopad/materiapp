import { UniversityCard } from './university-card';
import type { University } from '../types';

interface UniversitiesSectionProps {
    universities: University[];
}

/**
 * Section displaying all linked universities.
 */
export function UniversitiesSection({ universities }: UniversitiesSectionProps) {
    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold tracking-normal">Universidades</h1>

            {universities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tienes universidades vinculadas.</p>
            ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                    {universities.map((university) => (
                        <UniversityCard key={university.id} university={university} />
                    ))}
                </div>
            )}
        </section>
    );
}
