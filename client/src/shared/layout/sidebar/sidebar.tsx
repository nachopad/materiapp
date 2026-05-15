import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';
import { Outlet, useLocation } from 'react-router';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { Separator } from '@/shared/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { useBreadcrumbLabel } from '@/shared/hooks/use-breadcrumb';

export const Sidebar = () => {
    const breadcrumbLabel = useBreadcrumbLabel();
    const location = useLocation();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="mx-auto w-full max-w-2xl">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                                </BreadcrumbItem>
                                {location.pathname !== '/' && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex-1 px-4 pb-8">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};
