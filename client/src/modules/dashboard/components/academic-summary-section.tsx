import { ChartLine, GraduationCap, BookOpen, Trophy } from 'lucide-react';

import { DashboardSectionHeader } from './dashboard-section-header';
import type { AcademicSummary as AcademicSummaryType } from '../types';

interface AcademicSummaryProps {
    summary: AcademicSummaryType;
}

/**
 * Academic summary section displaying 4 KPI cards:
 * Carreras activas, Facultades inscriptas, Materias en curso, Materias aprobadas.
 */
export function AcademicSummarySection({ summary }: AcademicSummaryProps) {
    return (
        <section className="space-y-4">
            <DashboardSectionHeader title="Resumen académico" icon={ChartLine} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 dark:border-border/40">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-primary shrink-0" data-icon="inline-start" />
                        <div className="flex-1">
                            <div className="text-xl font-bold">{summary.activeCareers}</div>
                            <div className="text-xs text-muted-foreground">Carreras activas</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 dark:border-border/40">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary shrink-0" data-icon="inline-start" />
                        <div className="flex-1">
                            <div className="text-xl font-bold">{summary.facultiesEnrolled}</div>
                            <div className="text-xs text-muted-foreground">Facultades inscriptas</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 dark:border-border/40">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary shrink-0" data-icon="inline-start" />
                        <div className="flex-1">
                            <div className="text-xl font-bold">{summary.subjectsInProgress}</div>
                            <div className="text-xs text-muted-foreground">Materias en curso</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-border bg-transparent p-4 transition-all hover:opacity-80 dark:border-border/40">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-primary shrink-0" data-icon="inline-start" />
                        <div className="flex-1">
                            <div className="text-xl font-bold">{summary.subjectsApproved}</div>
                            <div className="text-xs text-muted-foreground">Materias aprobadas</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
