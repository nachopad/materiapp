interface YearDividerProps {
    year: number;
}

/**
 * Horizontal divider with year label for timeline sections.
 */
export function YearDivider({ year }: YearDividerProps) {
    return (
        <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">{year} año</span>
            <div className="h-px flex-1 bg-border" />
        </div>
    );
}
