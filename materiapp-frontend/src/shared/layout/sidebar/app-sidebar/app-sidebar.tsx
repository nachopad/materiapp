import { Sidebar, SidebarContent } from '@/shared/components/ui/sidebar';
import { SidebarHeader } from './sidebar-header';
import { SidebarFooter } from './sidebar-footer';

export const AppSidebar = () => {
    return (
        <Sidebar variant="sidebar">
            <SidebarHeader />
            <SidebarContent className='bg-background'>

            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
};
