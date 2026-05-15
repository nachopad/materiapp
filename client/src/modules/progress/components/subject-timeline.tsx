import type { Subject } from '../types';
import type { SubjectStatusUpdate } from '../utils';
import { SubjectNode } from './subject-node';
import { YearDivider } from './year-divider';

interface SubjectTimelineProps {
    onSubjectChange?: (subjectId: string, update: SubjectStatusUpdate) => void;
    subjects: Subject[];
}

/**
 * Groups subjects by year object for rendering.
 */
function groupSubjectsByYear(subjects: Subject[]): Map<number, Subject[]> {
    const groups = new Map<number, Subject[]>();

    for (const subject of subjects) {
        const current = groups.get(subject.year) ?? [];
        current.push(subject);
        groups.set(subject.year, current);
    }

    return groups;
}

/**
 * Calculates horizontal offset for wave path effect within a year group.
 * Creates a repeating S-curve pattern that works for any number of items.
 *
 * Each wave has 4 positions: [center, mid, max, mid] then repeats.
 * Waves alternate direction: left (-), right (+), left (-), right (+)...
 *
 * Pattern examples:
 * - 5 items:  [0, -45, -70, -45, 0]
 * - 9 items:  [0, -45, -70, -45, 0, 45, 70, 45, 0]
 * - 13 items: [0, -45, -70, -45, 0, 45, 70, 45, 0, -45, -70, -45, 0]
 * - 15 items: [0, -45, -70, -45, 0, 45, 70, 45, 0, -45, -70, -45, 0, 45, 0]
 *
 * @param index - Current item index within the year
 * @param total - Total number of items in the year
 * @returns Horizontal offset in pixels (negative = left, positive = right)
 */
function getSnakePathOffset(index: number, total: number): number {
    const MAX = 70;
    const MID = 45;

    // First and last are always centered
    if (index === 0 || index === total - 1) return 0;

    // Less than 3 items - all centered
    if (total < 3) return 0;

    // Wave pattern: [0, MID, MAX, MID] repeating every 4 positions
    const waveValues = [0, MID, MAX, MID];

    // Determine which wave (0, 1, 2, 3...) and position within wave (0, 1, 2, 3)
    const waveIndex = Math.floor(index / 4);
    const posInWave = index % 4;

    // Get the value from the wave pattern
    const value = waveValues[posInWave];

    // Direction alternates: even waves go left (-), odd waves go right (+)
    const direction = waveIndex % 2 === 0 ? -1 : 1;

    return direction * value;
}

/**
 * Timeline displaying subjects grouped by year with snake path effect.
 * Each year group has its own snake path that starts and ends centered.
 */
export function SubjectTimeline({ onSubjectChange, subjects }: SubjectTimelineProps) {
    const groupedSubjects = groupSubjectsByYear(subjects);
    const years = Array.from(groupedSubjects.keys()).sort((a, b) => a - b);

    if (subjects.length === 0) {
        return <div className="py-8 text-center text-muted-foreground">No hay materias registradas</div>;
    }

    return (
        <section className="flex flex-col items-center py-4">
            {years.map((year) => {
                const yearSubjects = groupedSubjects.get(year) ?? [];
                const totalInYear = yearSubjects.length;

                return (
                    <div key={year} className="w-full">
                        <YearDivider year={year} />
                        <div className="flex flex-col items-center gap-6">
                            {yearSubjects.map((subject, index) => {
                                const offset = getSnakePathOffset(index, totalInYear);
                                return (
                                    <SubjectNode
                                        key={subject.id}
                                        onSubjectChange={onSubjectChange}
                                        subject={subject}
                                        style={{ transform: `translateX(${offset}px)` }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
