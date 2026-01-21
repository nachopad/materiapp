import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { BookText } from 'lucide-react';
import type { Enrollment } from '../types';

interface EnrollmentCardProps {
    enrollment: Enrollment;
    isSelected?: boolean;
    onClick?: () => void;
}

/**
 * Card component displaying a single enrollment with university, career, and progress.
 */
export function EnrollmentCard({ enrollment, isSelected = false, onClick }: EnrollmentCardProps) {
    // Calculate progress based on approved subjects
    const approvedSubjects = enrollment.subjects.filter((s) => s.state === 'approved').length;
    const totalSubjects = enrollment.subjects.length;
    const progress = totalSubjects > 0 ? Math.round((approvedSubjects / totalSubjects) * 100) : 0;

    return (
        <article
            className={cn(
                'rounded-lg border bg-transparent p-4 transition-all cursor-pointer space-y-3 hover:opacity-80',
                isSelected ? 'border-primary' : 'border-border dark:border-border/40',
            )}
            onClick={onClick}
        >
            <header className="flex items-center justify-between">
                <Badge variant={isSelected ? 'default' : 'outline'}>Progreso {progress}%</Badge>
                <div
                    className={cn(
                        'aspect-square h-6 w-6 rounded-sm flex items-center justify-center',
                        isSelected ? 'bg-primary text-orange-50' : 'bg-border text-foreground/80',
                    )}
                >
                    <BookText className="h-4 w-4" />
                </div>
            </header>
            <h1 className="text-lg font-semibold leading-normal">{enrollment.career.name}</h1>
            <Progress
                value={progress}
                className="h-3 bg-border"
                classNameIndicator={cn(isSelected ? 'bg-primary' : 'bg-muted-foreground')}
            />
        </article>
    );
}
