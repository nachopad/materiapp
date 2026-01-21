import { Button } from '@/shared/components/ui/button';
import { TooltipComponent } from '@/shared/components/ui/tooltip';
import { BookText } from 'lucide-react';
import type { Career } from '../types';
import { Link } from 'react-router';

interface CareerHeaderCardProps {
    career: Career;
}

/**
 * Header card displaying university and career information with primary background.
 */
export function CareerHeaderCard({ career }: CareerHeaderCardProps) {
    return (
        <header className="bg-background sticky top-0 z-10">
            <article className="translate-y-1 flex items-center justify-between gap-4 rounded-lg bg-orange-500 px-4 py-5 text-primary-foreground">
                <div className="space-y-1 max-w-[80%]">
                    <p className="text-sm opacity-90 truncate uppercase font-semibold tracking-wider">
                        {career.universityName}
                    </p>
                    <h2 className="text-lg font-bold leading-tight">{career.name}</h2>
                </div>
                <TooltipComponent text="Carreras">
                    <Link to="/enrollments">
                        <Button
                            size="icon-lg"
                            variant="outline"
                            icon={<BookText className="size-5" />}
                            className="border-b-2! bg-orange-500! border-orange-600! text-primary-foreground! hover:bg-orange-500! hover:opacity-90"
                            aria-label="Ver detalles"
                        />
                    </Link>
                </TooltipComponent>
            </article>
        </header>
    );
}
