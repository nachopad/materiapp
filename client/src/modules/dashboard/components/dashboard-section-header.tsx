import type { LucideIcon } from 'lucide-react';

interface DashboardSectionHeaderProps {
    title: string;
    icon: LucideIcon;
}

export function DashboardSectionHeader({ title, icon }: DashboardSectionHeaderProps) {
    const Icon = icon;

    return (
        <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-orange-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6">
                <Icon data-icon="inline-start" aria-hidden="true" />
            </div>
            <h2 className="min-w-0 text-xl font-bold tracking-normal">{title}</h2>
        </div>
    );
}
