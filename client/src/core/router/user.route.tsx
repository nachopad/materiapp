import { Route } from 'react-router';
import { ProfilePage, EditProfilePage } from '@/modules/profile/pages';
import { ProgressPage } from '@/modules/progress/pages';
import { EnrollmentsPage } from '@/modules/enrollments/pages';
import { UniversitiesPage } from '@/modules/universities/pages';
import { CareersPage } from '@/modules/careers/pages';

export const UserRoutes = () => {
    return (
        <>
            <Route path="/" element={<>Dashboard</>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/enrollments" element={<EnrollmentsPage />} />
            <Route path="/universities" element={<UniversitiesPage />} />
            <Route path="/universities/:universityId/careers" element={<CareersPage />} />
            <Route path="/calendar" element={<>Calendar</>} />
            {/* Otras rutas */}
        </>
    );
};
