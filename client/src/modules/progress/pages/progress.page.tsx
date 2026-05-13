import { useState } from 'react';

import { CareerHeaderCard, CareerStats, SubjectTimeline } from '../components';
import { SUBJECT_STATUS } from '../types';
import type { Career } from '../types';
import { normalizeSubjectStatusUpdate, recalculateCareerProgress } from '../utils';
import type { SubjectStatusUpdate } from '../utils';

// Mock data for development (remove when backend is ready)
const MOCK_CAREER: Career = {
    id: '1',
    name: 'Analista Programador Universitario',
    universityName: 'Facultad de Ingeniería de Jujuy',
    progress: 50,
    approved: 15,
    regular: 0,
    pending: 15,
    average: 8.7,
    subjects: [
        { id: '1', name: 'Programación Estructurada', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 8 },
        { id: '2', name: 'Estructura de Datos', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '3', name: 'Herramientas Informáticas I', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '4', name: 'Inglés I', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '5', name: 'Herramientas Informáticas II', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '6', name: 'Laboratorio de Sistemas Operativos I', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 9 },
        { id: '7', name: 'Inglés II', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '8', name: 'Base de Datos I', status: SUBJECT_STATUS.PENDING, year: 1 },
        { id: '9', name: 'Laboratorio de Sistemas Operativos II', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '10', name: 'Base de Datos II', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '11', name: 'Programación Visual', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '12', name: 'Inglés III', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '13', name: 'Inglés IV', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '14', name: 'Programación Orientada a Objetos', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '15', name: 'Análisis y Diseño de Sistemas I', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '16', name: 'Álgebra I', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '17', name: 'Álgebra II', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '18', name: 'Programación Concurrente y Paralela', status: SUBJECT_STATUS.PENDING, year: 2 },
        { id: '19', name: 'Inglés V', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '20', name: 'Redes I', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '21', name: 'Programación y Servicios Web', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '22', name: 'Laboratorio de Programación Orientado a Objetos I', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '23', name: 'Análisis y Diseño de Sistemas II', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '24', name: 'Inglés VI', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '25', name: 'Redes II', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '26', name: 'Laboratorio de Programación Orientado a Objetos II', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '27', name: 'Herramientas Informáticas Avanzadas', status: SUBJECT_STATUS.PENDING, year: 3 },
        { id: '28', name: 'Legislación y Ejercicio Profesional', status: SUBJECT_STATUS.PENDING, year: 3 },
    ],
};

/**
 * Progress page displaying career progress and subject timeline.
 */
export default function ProgressPage() {
    const [career, setCareer] = useState(MOCK_CAREER);
    // const { data: careers, isLoading, isError, error } = useCareers();
    // const { selectedCareerId, selectCareer } = useProgressStore();

    // Auto-select first career when data loads
    // useEffect(() => {
    //     if (careers && careers.length > 0 && !selectedCareerId) {
    //         selectCareer(careers[0].id);
    //     }
    // }, [careers, selectedCareerId, selectCareer]);

    // TODO: Remove mock and use real data when backend is ready
    // const selectedCareer = careers?.find((c) => c.id === selectedCareerId);
    const selectedCareer = career;

    function handleSubjectChange(subjectId: string, update: SubjectStatusUpdate) {
        setCareer((currentCareer) => {
            const normalizedUpdate = normalizeSubjectStatusUpdate(update);
            const subjects = currentCareer.subjects.map((subject) =>
                subject.id === subjectId
                    ? { ...subject, status: normalizedUpdate.status, grade: normalizedUpdate.grade }
                    : subject,
            );

            return {
                ...currentCareer,
                ...recalculateCareerProgress(subjects),
                subjects,
            };
        });
    }

    // if (isLoading) {
    //     return (
    //         <>
    //             <MobilePageHeader title="Progreso" />
    //             <div className="space-y-6">
    //                 <Skeleton className="h-24 w-full rounded-lg" />
    //                 <div className="flex gap-2">
    //                     <Skeleton className="h-6 w-16" />
    //                     <Skeleton className="h-6 w-24" />
    //                     <Skeleton className="h-6 w-24" />
    //                     <Skeleton className="h-6 w-20" />
    //                 </div>
    //                 <Skeleton className="h-3 w-full" />
    //                 <div className="flex flex-col items-center gap-4 py-8">
    //                     {[...Array(5)].map((_, i) => (
    //                         <Skeleton key={i} className="h-10 w-32" />
    //                     ))}
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    // if (isError) {
    //     return (
    //         <>
    //             <MobilePageHeader title="Progreso" />
    //             <div className="flex items-center justify-center p-8">
    //                 <p className="text-destructive">Error: {error?.message ?? 'Error al cargar el progreso'}</p>
    //             </div>
    //         </>
    //     );
    // }

    if (!selectedCareer) {
        return (
            <>
                <div className="flex items-center justify-center p-8">
                    <p className="text-muted-foreground">No hay carreras registradas</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <CareerHeaderCard career={selectedCareer} />
                <CareerStats career={selectedCareer} />
                <SubjectTimeline onSubjectChange={handleSubjectChange} subjects={selectedCareer.subjects} />
            </div>
        </>
    );
}
