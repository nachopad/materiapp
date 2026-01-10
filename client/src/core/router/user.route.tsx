import { Route } from 'react-router';

export const UserRoutes = () => {
    return (
        <>
            <Route path="/" element={<>Dashboard</>} />
            <Route path="/profile" element={<>Profile</>} />
            <Route path="/progress" element={<>Progress</>} />
            <Route path="/universities" element={<>Universities</>} />
            <Route path="/calendar" element={<>Calendar</>} />
            {/* Otras rutas */}
        </>
    );
};
