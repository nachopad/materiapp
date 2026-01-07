import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { Outlet } from 'react-router';
import { AppSidebar } from './app-sidebar/app-sidebar';

export const Sidebar = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className="min-h-screen p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
