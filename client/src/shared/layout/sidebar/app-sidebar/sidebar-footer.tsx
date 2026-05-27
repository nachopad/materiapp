import { Bell, ChevronsUpDown, CreditCard, LogOut, MoonIcon, SunIcon, UserCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router';

import { useLogoutMutation } from '@/modules/auth/hooks/use-logout-mutation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/components/ui/sidebar';

function getInitials(name: string): string {
    const trimmed = name?.trim();
    if (!trimmed) return 'U';
    const parts = trimmed.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase() || 'U';
}

interface SidebarFooterProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export const SidebarFooterComponent = ({ user }: SidebarFooterProps) => {
    const { isMobile } = useSidebar();
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const { mutate, isPending, isError } = useLogoutMutation();

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const displayName = user.name?.trim() || 'Usuario';
    const displayEmail = user.email?.trim() || 'Sin email disponible';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                                <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{displayName}</span>
                                <span className="truncate text-xs">{displayEmail}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {user.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
                                    <AvatarFallback className="rounded-lg">{getInitials(displayName)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{displayName}</span>
                                    <span className="truncate text-xs">{displayEmail}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={toggleTheme}>
                                {isDark ? <SunIcon /> : <MoonIcon />}
                                {isDark ? 'Tema claro' : 'Tema oscuro'}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link to="/profile">
                                <DropdownMenuItem>
                                    <UserCircle />
                                    Perfil
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={isPending}
                            onSelect={() => mutate()}
                        >
                            <LogOut />
                            {isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </DropdownMenuItem>
                        {isError && (
                            <p className="text-destructive text-sm px-2 py-1.5 text-center" role="alert">
                                Error al cerrar sesión. Inténtalo de nuevo.
                            </p>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};
