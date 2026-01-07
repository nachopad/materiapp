import { Route } from 'react-router';

export const UserRoutes = () => {
    return (
        <>
            <Route path="/" element={<>Dashboard</>} />
            <Route path="/profile" element={<>Profile</>} />
            <Route path="/progress" element={<>Progress</>} />
            {/* Otras rutas */}
        </>
    );
};
