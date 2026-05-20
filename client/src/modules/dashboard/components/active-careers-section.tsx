import { GraduationCap } from 'lucide-react';

import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { DashboardSectionHeader } from './dashboard-section-header';
import type { ActiveCareer } from '../types';

interface ActiveCareersSectionProps {
    careers: ActiveCareer[];
}

/**
 * Card displaying active careers with details and progress bars.
 */
export function ActiveCareersSection({ careers }: ActiveCareersSectionProps) {
    return (
        <section className="space-y-4">
            <DashboardSectionHeader title="Carreras activas" icon={GraduationCap} />
            <div className="space-y-2">
                {careers.length === 0 ? (
                    <div className="rounded-lg border border-border bg-transparent p-4 text-center text-muted-foreground transition-all hover:opacity-80 dark:border-border/40">
                        No hay carreras activas
                    </div>
                ) : (
                    careers.map((career) => (
                        <div key={career.id} className="rounded-lg border border-border bg-transparent p-4 space-y-3 transition-all hover:opacity-80 dark:border-border/40">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary shrink-0" data-icon="inline-start" />
                                    <div>
                                        <div className="font-medium">{career.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {career.facultyName} • {career.year}° año
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary">{career.progress}%</Badge>
                            </div>
                            <Progress value={career.progress} className="h-2" classNameIndicator="bg-primary" />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
