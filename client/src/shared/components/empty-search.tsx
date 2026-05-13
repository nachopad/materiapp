import { FileSearch, SearchXIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shared/components/ui/empty';

interface EmptySearchProps {
    title: string;
    description?: string;
    onClearSearch: () => void;
    clearButtonText?: string;
}

/**
 * Reusable empty state for search results with no matches.
 * Composes the shadcn/ui Empty component.
 */
export function EmptySearch({
    title,
    description,
    onClearSearch,
    clearButtonText = 'Limpiar búsqueda',
}: EmptySearchProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FileSearch />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                {description ? <EmptyDescription>{description}</EmptyDescription> : null}
            </EmptyHeader>
            <EmptyContent>
                <Button type="button" variant="outline" icon={<SearchXIcon />} onClick={onClearSearch}>
                    {clearButtonText}
                </Button>
            </EmptyContent>
        </Empty>
    );
}
