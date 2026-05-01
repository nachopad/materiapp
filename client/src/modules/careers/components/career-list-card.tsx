import { useState } from 'react';
import { Clock, BookOpen } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';
import { CareerEnrollmentForm } from './career-enrollment-form';
import type { Career } from '../types';

interface CareerListCardProps {
    career: Career;
}

/**
 * Card component displaying a single career with enrollment status.
 * - Non-enrolled: entire card is a button trigger for enrollment popover
 * - Enrolled: displays article with read-only enrolled badge
 */
export function CareerListCard({ career }: CareerListCardProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const isEnrolled = useEnrollmentsStore((state) => state.isEnrolled(career.id));

    if (isEnrolled) {
        return (
            <article className="rounded-lg border border-border bg-transparent p-4 transition-all hover:shadow-sm overflow-hidden">
                <header className="flex items-start gap-3">
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-semibold truncate">{career.name}</h2>
                            <Badge
                                variant="secondary"
                                className="shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                aria-label="Inscrito en esta carrera"
                            >
                                Inscripto
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>{career.totalSubjects} {career.totalSubjects === 1 ? 'materia' : 'materias'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>{career.durationYears} {career.durationYears === 1 ? 'año' : 'años'}</span>
                            </span>
                        </div>
                    </div>
                </header>
            </article>
        );
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="w-full rounded-lg border border-border bg-transparent p-4 transition-all hover:shadow-sm overflow-hidden text-left cursor-pointer"
                    aria-label={`Ver opciones de inscripción para ${career.name}`}
                >
                    <header className="flex items-start gap-3">
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <h2 className="text-base font-semibold truncate">{career.name}</h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>{career.totalSubjects} {career.totalSubjects === 1 ? 'materia' : 'materias'}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>{career.durationYears} {career.durationYears === 1 ? 'año' : 'años'}</span>
                                </span>
                            </div>
                        </div>
                    </header>
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="w-80 max-h-96 overflow-y-auto"
            >
                <CareerEnrollmentForm
                    careerId={career.id}
                    careerName={career.name}
                    onSuccess={() => setPopoverOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}