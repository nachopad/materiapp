import { useAuthUser } from '@/modules/auth/hooks/use-auth';
import { Pity } from '@/assets/icons';
import { Separator } from '@/shared/components/ui/separator';
import { useUserStore } from '@/modules/profile/store';

import { AcademicSummarySection, CurrentSubjectsSection, ActiveCareersSection } from '../components';
import type { DashboardHome } from '../types';

const MOCK_DASHBOARD: DashboardHome = {
    summary: {
        activeCareers: 2,
        facultiesEnrolled: 3,
        subjectsInProgress: 5,
        subjectsApproved: 15,
    },
    currentSubjects: [
        { id: '1', name: 'Matemática Discreta', careerName: 'Analista Programador' },
        { id: '2', name: 'Programación I', careerName: 'Analista Programador' },
        { id: '3', name: 'Base de Datos', careerName: 'Analista Programador' },
    ],
    activeCareersList: [
        {
            id: '1',
            name: 'Analista Programador Universitario',
            facultyName: 'Facultad de Informática',
            year: 2,
            progress: 35,
        },
        { id: '2', name: 'Licenciatura en Sistemas', facultyName: 'Facultad de Informática', year: 1, progress: 20 },
    ],
};

/**
 * Dashboard home page displaying academic summary, current subjects, and active careers.
 * This page replaces the placeholder at the authenticated root route `/`.
 */
export default function HomePage({
    dashboard = MOCK_DASHBOARD,
    userName,
}: {
    dashboard?: DashboardHome;
    userName?: string;
}) {
    const authUser = useAuthUser();
    const { user } = useUserStore();
    const displayName = authUser?.name?.trim()?.split(' ')[0] || userName || user?.fullName?.trim()?.split(' ')[0] || 'Usuario';

    return (
        <div className="container mx-auto max-w-3xl px-4 py-6">
            {/* Welcome header */}
            <div className="flex items-center gap-3">
                <Pity className="h-10 w-10 shrink-0" aria-label="icono de bienvenida" />
                <div className="text-start">
                    <h1 className="text-2xl font-bold">¡Bienvenido, {displayName}!</h1>
                    <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad académica</p>
                </div>
            </div>
            <Separator className="mt-4 mb-4" />
            <div className="flex flex-col gap-4">
                <AcademicSummarySection summary={dashboard.summary} />
                <CurrentSubjectsSection subjects={dashboard.currentSubjects} />
                <ActiveCareersSection careers={dashboard.activeCareersList} />
            </div>
        </div>
    );
}
