import { LayoutSidebar } from '@/shared/layout/sidebar/layout-sidebar/layout-sidebar';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AdminRoutes } from './admin.route';
import { PublicRoutes } from './public.route';
import { UserRoutes } from './user.route';

const Router = () => {
    const isAuthenticated = false; // Placeholder for actual authentication logic
    const role: string = 'admin'; // Placeholder for actual user role logic

    return (
        <BrowserRouter>
            <Routes>
                {isAuthenticated ? (
                    <Route element={<LayoutSidebar />}>
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
