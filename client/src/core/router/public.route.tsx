import LoginPage from '@/modules/auth/pages/login.page';
import RegisterPage from '@/modules/auth/pages/register.page';
import HomePage from '@/modules/home/home.page';
import { Route } from 'react-router';

export const PublicRoutes = () => {
    return (
        <>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
        </>
    );
};
