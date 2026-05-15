import type { CSSProperties } from 'react';
import { Book, Check } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

import { SUBJECT_STATUS } from '../types';
import type { Subject } from '../types';
import { STATUS_LABELS } from '../utils';
import type { SubjectStatusUpdate } from '../utils';
import { SubjectStatusPopover } from './subject-status-popover';

interface SubjectNodeProps {
    className?: string;
    onSubjectChange?: (subjectId: string, update: SubjectStatusUpdate) => void;
    subject: Subject;
    style?: CSSProperties;
}

/**
 * Individual subject node in the timeline.
 * Shows a badge with the subject name and a circle indicator.
 */
export function SubjectNode({ subject, className, onSubjectChange, style }: SubjectNodeProps) {
    const isApproved = subject.status === SUBJECT_STATUS.APPROVED;
    const isInProgress = subject.status === SUBJECT_STATUS.REGULAR;

    const content = (
        <article className={cn('flex flex-col items-center', className)} style={style}>
            <Badge
                variant={isApproved ? 'default' : 'secondary'}
                className={cn(
                    'mb-2 max-w-[32ch] text-center text-sm sm:max-w-full',
                    isApproved && 'bg-orange-500 text-orange-50',
                    isInProgress && 'bg-yellow-500 text-yellow-950',
                    !isApproved && !isInProgress && 'bg-gray-600 text-gray-50',
                )}
            >
                <span className="truncate">{subject.name}</span>
            </Badge>
            <div
                className={cn(
                    'flex aspect-square w-20 items-center justify-center rounded-full border-2 border-b-6',
                    isApproved && 'bg-orange-500 border-orange-700',
                    isInProgress && 'bg-yellow-500 border-yellow-700',
                    !isApproved && !isInProgress && 'bg-gray-500 border-gray-600',
                )}
                aria-hidden="true"
            >
                {isApproved ? (
                    <Check className="size-10 text-orange-50" strokeWidth={4} />
                ) : isInProgress ? (
                    <Book className="size-10 text-yellow-950" strokeWidth={3} />
                ) : (
                    <Book className="size-10 text-gray-50" strokeWidth={3} />
                )}
            </div>
        </article>
    );

    if (!onSubjectChange) {
        return content;
    }

    return (
        <SubjectStatusPopover subject={subject} onSubjectChange={(update) => onSubjectChange(subject.id, update)}>
            <button
                type="button"
                className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${subject.name}: ${STATUS_LABELS[subject.status]}. Editar estado`}
            >
                {content}
            </button>
        </SubjectStatusPopover>
    );
}
