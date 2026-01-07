import { Outlet } from 'react-router';
import { useIsMobile } from '../hooks/use-mobile';
import { Sidebar } from './sidebar/sidebar';

export const AuthLayout = () => {
    const isMobile = useIsMobile();

    return (
        <>
            {!isMobile ? (
                <Sidebar />
            ) : (
                <main className="min-h-screen p-4">
                    <Outlet />
                </main>
            )}
        </>
    );
};
