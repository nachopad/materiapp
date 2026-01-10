import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { Separator } from '@/shared/components/ui/separator';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useCallback, useEffect } from 'react';
import { AccountSection, ProfileHeader, ProgressSection, UniversitiesSection } from '../components';
import { useUserStore } from '../store';
import type { UserProfile } from '../types';
import { LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

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
            <Button
                variant="outline"
                className="dark:bg-transparent border-destructive dark:border-destructive"
                fullWidth
                icon={<LogOut />}
            >
                Cerrar sesión
            </Button>
        </>
    );
}
