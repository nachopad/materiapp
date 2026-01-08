import { BrowserRouter, Route, Routes } from 'react-router';

import { AuthLayout } from '@/shared/layout/auth.layout';
import { AdminRoutes } from './admin.route';
import { PublicRoutes } from './public.route';
import { UserRoutes } from './user.route';

const Router = () => {
    const isAuthenticated = true; // Placeholder for actual authentication logic
    const role: string = 'admin'; // Placeholder for actual user role logic

    return (
        <BrowserRouter>
            <Routes>
                {isAuthenticated ? (
                    <Route element={<AuthLayout />}>
                        {UserRoutes()}
                        {role === 'admin' && AdminRoutes()}
                    </Route>
                ) : (
                    PublicRoutes()
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
