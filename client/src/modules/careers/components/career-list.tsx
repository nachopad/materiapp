import type { Career } from '../types';
import { CareerListCard } from './career-list-card';

interface CareerListProps {
    careers: Career[];
}

/**
 * Semantic list wrapper for careers.
 * Renders careers as an accessible ul/li structure.
 */
export function CareerList({ careers }: CareerListProps) {
    return (
        <ul className="space-y-3" aria-label={`${careers.length} carreras disponibles`}>
            {careers.map((career) => (
                <li key={career.id}>
                    <CareerListCard career={career} />
                </li>
            ))}
        </ul>
    );
}