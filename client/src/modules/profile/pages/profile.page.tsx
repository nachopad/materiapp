import { LogOut } from 'lucide-react';
import { useCallback, useEffect } from 'react';

import { useLogoutMutation } from '@/modules/auth/hooks/use-logout-mutation';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { AccountSection, ProfileHeader, ProgressSection, UniversitiesSection } from '../components';
import { useUserStore } from '../store';
import type { UserProfile } from '../types';

// Mock data for development (remove when backend is ready)
const MOCK_USER: UserProfile = {
    id: '1',
    fullName: 'Maximiliano Joaquín Carrillo',
    email: 'maxi11carrillo@gmail.com',
    joinedAt: '2025-08-25',
    avatarUrl: undefined,
    accountProviders: [
        { provider: 'google', isLinked: false, email: 'maxi11carrillo@gmail.com' },
        { provider: 'email', isLinked: true },
    ],
    universities: [
        { id: '1', name: 'Universidad Nacional de Jujuy', enrollmentDate: '2021-03-01' },
        { id: '2', name: 'Universidad Nacional de Córdoba', enrollmentDate: '2022-08-25' },
        { id: '3', name: 'Universidad Tecnológica Nacional', enrollmentDate: '2025-08-25' },
    ],
    careerProgress: [
        { id: '1', name: 'Analista Programador Universitario', percentage: 70, approved: 16, regular: 5, pending: 8 },
        { id: '2', name: 'Ingeniería en Informática', percentage: 10, approved: 16, regular: 5, pending: 8 },
    ],
};

/**
 * Profile page displaying user information, account settings,
 * linked universities and career progress.
 */
export default function ProfilePage() {
    const { user, isLoading, error, fetchProfile } = useUserStore();

    useEffect(() => {
        // TODO: Remove mock and use fetchProfile() when backend is ready
        // fetchProfile();
    }, [fetchProfile]);

    const handleChangePassword = useCallback(() => {
        // TODO: Implement change password modal
        console.log('Change password clicked');
    }, []);

    const handleLinkGoogle = useCallback(() => {
        // TODO: Implement Google OAuth flow
        console.log('Link Google clicked');
    }, []);

    // Use mock data for now
    const displayUser = user || MOCK_USER;

    if (isLoading) {
        return (
            <div className="space-y-8 p-4 lg:p-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-destructive">Error: {error}</p>
            </div>
        );
    }

    return (
        <>
            <MobilePageHeader title="Perfil" />
            <ProfileHeader user={displayUser} />
            <Separator className="mt-6 mb-2" />
            <div className="space-y-8">
                <AccountSection
                    providers={displayUser.accountProviders}
                    onChangePassword={handleChangePassword}
                    onLinkGoogle={handleLinkGoogle}
                />
                <UniversitiesSection universities={displayUser.universities} />
                <ProgressSection careers={displayUser.careerProgress} />
            </div>
            <Separator className="mt-10 mb-10" />
            <LogoutButton />
        </>
    );
}

function LogoutButton() {
    const { mutate, isPending, isError } = useLogoutMutation();

    return (
        <div className="space-y-2">
            <Button
                variant="outline"
                className="bg-transparent! border-destructive! text-destructive! hover:bg-destructive! hover:text-white!"
                disabled={isPending}
                fullWidth
                icon={<LogOut />}
                onClick={() => mutate()}
            >
                {isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </Button>
            {isError && (
                <p className="text-destructive text-sm text-center" role="alert">
                    Error al cerrar sesión. Inténtalo de nuevo.
                </p>
            )}
        </div>
    );
}
