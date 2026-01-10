import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Calendar, ChartLine, Home, University, UserCircle } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';

const items = [
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
    {
        title: 'Calendario',
        url: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Perfil',
        url: '/profile',
        icon: UserCircle,
    },
];

export const Mobile = () => {
    const location = useLocation();

    return (
        <div className="h-screen grid grid-rows-[1fr_auto]">
            <main className="h-[200vh] p-4">
                <Outlet />
            </main>
            <div className="border-t bg-sidebar/50 flex justify-around p-4 fixed bottom-0 left-0 right-0">
                {items.map((item) => (
                    <Link key={item.title} to={item.url}>
                        <Button
                            className={cn(location.pathname === item.url && 'border-ring ring-[2px] ring-ring/50')}
                            variant="ghost"
                            icon={<item.icon className="size-5" />}
                            size={'icon-lg'}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};
