import { useAuthUser } from '@/modules/auth/hooks/use-auth';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/shared/components/ui/sidebar';

import { SidebarFooterComponent } from './sidebar-footer';
import { SidebarHeaderComponent } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

const data = {
    versions: ['Administrador', 'Usuario'],
};

export const AppSidebar = () => {
    const auth = useAuthUser();
    const user = {
        name: auth?.name?.trim() || 'Usuario',
        email: auth?.email?.trim() || 'Sin email disponible',
    };

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="bg-background/50">
                <SidebarHeaderComponent versions={data.versions} defaultVersion={data.versions[0]} />
            </SidebarHeader>
            <SidebarContent className="bg-background/50">
                <SidebarMenu />
            </SidebarContent>
            <SidebarFooter className="bg-background/50">
                <SidebarFooterComponent user={user} />
            </SidebarFooter>
        </Sidebar>
    );
};
