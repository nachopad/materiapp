import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import { Book, Check } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Subject } from '../types';

interface SubjectNodeProps {
    className?: string;
    subject: Subject;
    style?: CSSProperties;
}

/**
 * Individual subject node in the timeline.
 * Shows a badge with the subject name and a circle indicator.
 */
export function SubjectNode({ subject, className, style }: SubjectNodeProps) {
    const isApproved = subject.status === 'approved';

    return (
        <article className={cn('flex flex-col items-center', className)} style={style}>
            <Badge
                variant={isApproved ? 'default' : 'secondary'}
                className={cn(
                    'mb-2 text-center text-sm max-w-[32ch] sm:max-w-full',
                    isApproved ? 'bg-emerald-500 text-emerald-50' : 'bg-gray-500 text-gray-50',
                )}
            >
                <span className="truncate">{subject.name}</span>
            </Badge>
            <div
                className={cn(
                    'aspect-square w-20 rounded-full flex items-center justify-center border-2 border-b-6',
                    isApproved ? 'bg-emerald-500 border-emerald-700' : 'bg-gray-500 border-gray-600',
                )}
                aria-label={`${subject.name}: ${isApproved ? 'Aprobada' : 'Pendiente'}`}
            >
                {isApproved ? (
                    <Check className="size-10 text-emerald-50" strokeWidth={4} />
                ) : (
                    <Book className="size-10 text-gray-50" strokeWidth={3} />
                )}
            </div>
        </article>
    );
}
