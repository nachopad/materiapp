import { BrowserRouter, Route, Routes } from 'react-router';

import { AuthBootstrap } from '@/modules/auth/components/auth-bootstrap';
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from '@/modules/auth/components/route-gates';
import { useIsAuthenticated } from '@/modules/auth/hooks/use-auth';
import { AUTH_ROLE } from '@/modules/auth/types/auth.types';
import { AuthLayout } from '@/shared/layout/auth.layout';

import { AdminRoutes } from './admin.route';
import { PublicRoutes } from './public.route';
import { UserRoutes } from './user.route';

const Router = () => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <BrowserRouter>
            <AuthBootstrap>
                <Routes>
                    {isAuthenticated ? (
                        <Route element={<AuthLayout />}>
                            <Route element={<ProtectedRoute />}>
                                {UserRoutes()}
                            </Route>
                            <Route element={<RoleRoute role={AUTH_ROLE.ADMIN} />}>
                                {AdminRoutes()}
                            </Route>
                        </Route>
                    ) : (
                        <Route element={<PublicOnlyRoute />}>
                            {PublicRoutes()}
                        </Route>
                    )}
                </Routes>
            </AuthBootstrap>
        </BrowserRouter>
    );
};

export default Router;
