import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuButton,
    SidebarMenu as SidebarMenuComponent,
    SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { Calendar, ChartLine, Home, University, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const items: { title: string; url: string; icon: LucideIcon }[] = [
    {
        title: 'Inicio',
        url: '/',
        icon: Home,
    },
    {
        title: 'Progreso',
        url: '/progress',
        icon: ChartLine,
    },
    {
        title: 'Universidades',
        url: '/universities',
        icon: University,
    },
    // {
    //     title: 'Calendario',
    //     url: '/calendar',
    //     icon: Calendar,
    // },
];

export const SidebarMenu = () => {
    const location = useLocation();

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenuComponent className="gap-2">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url}>
                                <Link to={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenuComponent>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
