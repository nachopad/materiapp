import { Route } from 'react-router';
import { ProfilePage, EditProfilePage } from '@/modules/profile/pages';
import { ProgressPage } from '@/modules/progress/pages';

export const UserRoutes = () => {
    return (
        <>
            <Route path="/" element={<>Dashboard</>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/universities" element={<>Universities</>} />
            <Route path="/calendar" element={<>Calendar</>} />
            {/* Otras rutas */}
        </>
    );
};
