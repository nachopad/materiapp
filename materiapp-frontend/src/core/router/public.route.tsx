import HomePage from '@/modules/home/home.page';
import { Route } from 'react-router';

export const PublicRoutes = () => {
    return (
        <>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<>Register</>} />
            <Route path="/login" element={<>Login</>} />
        </>
    );
};
