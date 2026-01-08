import { Separator } from '@/shared/components/ui/separator';

interface TextDividerProps {
    text?: string;
}

export function TextDivider({ text = 'Ó' }: TextDividerProps) {
    return (
        <div className="relative" role="separator">
            <div className="absolute inset-0 flex items-center">
                <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{text}</span>
            </div>
        </div>
    );
}
