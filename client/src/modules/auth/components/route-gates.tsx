import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "../store/auth.store";
import type { AuthRole } from "../types/auth.types";

export function ProtectedRoute() {
	const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

export function PublicOnlyRoute() {
	const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}

interface RoleRouteProps {
	role: AuthRole;
	fallback?: string;
}

export function RoleRoute({ role, fallback = "/" }: RoleRouteProps) {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.status === "authenticated");

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!user?.roles.includes(role)) {
		return <Navigate to={fallback} replace />;
	}

	return <Outlet />;
}
