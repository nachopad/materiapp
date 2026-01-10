import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/shared/components/ui/sidebar';
import { SidebarFooterComponent } from './sidebar-footer';
import { SidebarHeaderComponent } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    versions: ['Administrador', 'Usuario'],
};

export const AppSidebar = () => {
    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="bg-background/50">
                <SidebarHeaderComponent versions={data.versions} defaultVersion={data.versions[0]} />
            </SidebarHeader>
            <SidebarContent className="bg-background/50">
                <SidebarMenu />
            </SidebarContent>
            <SidebarFooter className="bg-background/50">
                <SidebarFooterComponent user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
};
