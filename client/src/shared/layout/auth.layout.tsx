import { useIsMobile } from '../hooks/use-mobile';
import { Mobile } from './mobile/mobile';
import { Sidebar } from './sidebar/sidebar';

export const AuthLayout = () => {
    const isMobile = useIsMobile();

    return <>{!isMobile ? <Sidebar /> : <Mobile />}</>;
};
