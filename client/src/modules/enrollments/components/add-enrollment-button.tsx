import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

interface AddEnrollmentButtonProps {
    onClick?: () => void;
}

/**
 * Floating button to add a new enrollment.
 */
export function AddEnrollmentButton({ onClick }: AddEnrollmentButtonProps) {
    return (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-3 px-4 pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <Button
                    key={i}
                    size="icon"
                    variant="outline"
                    icon={<Plus className="size-5" />}
                    onClick={onClick}
                    className="pointer-events-auto bg-background border-2 border-b-4 hover:scale-110 transition-transform"
                    aria-label="Agregar nueva carrera"
                />
            ))}
        </div>
    );
}
