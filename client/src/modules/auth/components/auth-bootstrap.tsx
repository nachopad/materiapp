"use client";

import { useEffect } from "react";

import { useAuthStore } from "../store/auth.store";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
	const bootstrap = useAuthStore((state) => state.bootstrap);
	const status = useAuthStore((state) => state.status);

	useEffect(() => {
		bootstrap();
	}, [bootstrap]);

	if (status === "idle" || status === "loading") {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return <>{children}</>;
}
