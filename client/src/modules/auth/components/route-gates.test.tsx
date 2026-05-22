import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';

import { useAuthStore } from '../store/auth.store';
import { ProtectedRoute, PublicOnlyRoute, RoleRoute } from './route-gates';

describe('route-gates', () => {
    beforeEach(() => {
        useAuthStore.setState({ status: 'idle', user: null });
    });

    describe('ProtectedRoute', () => {
        it('redirects to /login when anonymous', () => {
            useAuthStore.setState({ status: 'anonymous', user: null });

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Routes>
                        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
        });

        it('renders children when authenticated', () => {
            useAuthStore.setState({
                status: 'authenticated',
                user: { id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false },
            });

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Routes>
                        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('dashboard')).toBeInTheDocument();
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        });
    });

    describe('PublicOnlyRoute', () => {
        it('redirects to / when authenticated', () => {
            useAuthStore.setState({
                status: 'authenticated',
                user: { id: '1', email: 'a@b.com', name: 'Test', roles: ['user'], isGoogleUser: false },
            });

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/" element={<div data-testid="home-page">Home</div>} />
                        <Route element={<PublicOnlyRoute />}>
                            <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
        });

        it('renders children when anonymous', () => {
            useAuthStore.setState({ status: 'anonymous', user: null });

            render(
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/" element={<div data-testid="home-page">Home</div>} />
                        <Route element={<PublicOnlyRoute />}>
                            <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
        });
    });

    describe('RoleRoute', () => {
        it('allows access for admin role', () => {
            useAuthStore.setState({
                status: 'authenticated',
                user: { id: '1', email: 'a@b.com', name: 'Admin', roles: ['admin'], isGoogleUser: false },
            });

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route path="/" element={<div data-testid="home-page">Home</div>} />
                        <Route element={<RoleRoute role="admin" />}>
                            <Route path="/admin" element={<div data-testid="admin-page">Admin</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('admin-page')).toBeInTheDocument();
            expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
        });

        it('redirects to fallback for non-admin user', () => {
            useAuthStore.setState({
                status: 'authenticated',
                user: { id: '1', email: 'a@b.com', name: 'User', roles: ['user'], isGoogleUser: false },
            });

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route path="/" element={<div data-testid="home-page">Home</div>} />
                        <Route element={<RoleRoute role="admin" />}>
                            <Route path="/admin" element={<div data-testid="admin-page">Admin</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();
        });

        it('redirects to /login when anonymous', () => {
            useAuthStore.setState({ status: 'anonymous', user: null });

            render(
                <MemoryRouter initialEntries={['/admin']}>
                    <Routes>
                        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                        <Route element={<RoleRoute role="admin" />}>
                            <Route path="/admin" element={<div data-testid="admin-page">Admin</div>} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();
        });
    });
});
