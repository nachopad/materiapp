import { Materiapp } from '@/assets/icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/components/ui/sidebar';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface SidebarHeaderProps {
    versions: string[];
    defaultVersion: string;
}

export const SidebarHeaderComponent = ({ versions, defaultVersion }: SidebarHeaderProps) => {
    const [selectedVersion, setSelectedVersion] = useState(defaultVersion);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <figure>
                                <Materiapp className="size-8" />
                            </figure>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-medium">Materiapp</span>
                                <span className="">{selectedVersion}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
                        {versions.map((version) => (
                            <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
                                {version} {version === selectedVersion && <Check className="ml-auto" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
