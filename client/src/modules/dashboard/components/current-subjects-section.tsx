import { BookOpen } from 'lucide-react';
import type { CurrentSubject } from '../types';

interface CurrentSubjectsSectionProps {
    subjects: CurrentSubject[];
}

/**
 * Card displaying currently enrolled subjects with details.
 */
export function CurrentSubjectsSection({ subjects }: CurrentSubjectsSectionProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="aspect-square h-6 w-6 rounded-sm border border-border flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-primary" data-icon="inline-start" />
                </div>
                <h2 className="text-xl font-semibold">Materias cursando actualmente</h2>
            </div>
            <div className="space-y-2">
                {subjects.length === 0 ? (
                    <div className="rounded-lg border border-border bg-transparent p-4 text-center text-muted-foreground dark:border-border/40">
                        No hay materias en curso
                    </div>
                ) : (
                    subjects.map((subject) => (
                        <div className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 dark:border-border/40">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-primary shrink-0" data-icon="inline-start" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">{subject.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {subject.careerName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
