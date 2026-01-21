import { useNavigate } from 'react-router';
import { AddEnrollmentButton, EnrollmentList } from '../components';
import type { Enrollment } from '../types';
import { useEnrollmentsStore } from '../store';

// Mock data for development (remove when backend is ready)
const MOCK_ENROLLMENTS: Enrollment[] = [
    {
        _id: '1',
        college: {
            _id: 'college-1',
            name: 'Facultad de Ingeniería de Jujuy',
        },
        career: {
            _id: 'career-1',
            name: 'Analista Programador Universitario',
        },
        subjects: [
            {
                subject: { _id: 's1', name: 'Programación Estructurada', year: 1 },
                state: 'approved',
                qualification: 8,
                date: new Date('2023-07-15'),
            },
            {
                subject: { _id: 's2', name: 'Estructura de Datos', year: 1 },
                state: 'approved',
                qualification: 9,
                date: new Date('2023-12-10'),
            },
            {
                subject: { _id: 's3', name: 'Base de Datos I', year: 2 },
                state: 'stateless',
            },
            {
                subject: { _id: 's4', name: 'Programación Orientada a Objetos', year: 2 },
                state: 'stateless',
            },
        ],
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-12-10'),
    },
    {
        _id: '2',
        college: {
            _id: 'college-1',
            name: 'Facultad de Ingeniería de Jujuy',
        },
        career: {
            _id: 'career-2',
            name: 'Licenciatura en Informatica',
        },
        subjects: [
            {
                subject: { _id: 's5', name: 'Álgebra I', year: 1 },
                state: 'approved',
                qualification: 7,
                date: new Date('2024-07-20'),
            },
            {
                subject: { _id: 's6', name: 'Análisis Matemático I', year: 1 },
                state: 'stateless',
            },
        ],
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-07-20'),
    },
    {
        _id: '3',
        college: {
            _id: 'college-2',
            name: 'Universidad Tecnologica Nacional',
        },
        career: {
            _id: 'career-3',
            name: 'Ingenieria en Informatica',
        },
        subjects: [
            {
                subject: { _id: 's7', name: 'Sistemas de Representación', year: 1 },
                state: 'stateless',
            },
            {
                subject: { _id: 's8', name: 'Matemática Discreta', year: 1 },
                state: 'stateless',
            },
            {
                subject: { _id: 's9', name: 'Algoritmos y Estructuras de Datos', year: 1 },
                state: 'stateless',
            },
        ],
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-01'),
    },
];

/**
 * Enrollments page displaying all user career enrollments.
 */
export default function EnrollmentsPage() {
    const navigate = useNavigate();
    const { selectedEnrollmentId, selectEnrollment } = useEnrollmentsStore();

    // const { data: enrollments, isLoading, isError, error } = useEnrollments();

    // TODO: Remove mock and use real data when backend is ready
    const enrollments = MOCK_ENROLLMENTS;

    const handleSelectEnrollment = (id: string) => {
        selectEnrollment(id);
        navigate('/progress');
    };

    const handleAddEnrollment = () => {
        // TODO: Implement enrollment creation flow
        console.log('Add enrollment clicked');
    };

    // if (isLoading) {
    //     return (
    //         <>
    //             <div className="space-y-6">
    //                 <Skeleton className="h-12 w-48" />
    //                 <div className="space-y-3">
    //                     {[...Array(3)].map((_, i) => (
    //                         <Skeleton key={i} className="h-32 w-full rounded-lg" />
    //                     ))}
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    // if (isError) {
    //     return (
    //         <>
    //             <div className="flex items-center justify-center p-8">
    //                 <p className="text-destructive">Error: {error?.message ?? 'Error al cargar las carreras'}</p>
    //             </div>
    //         </>
    //     );
    // }

    if (!enrollments || enrollments.length === 0) {
        return (
            <>
                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <p className="text-muted-foreground text-center">No tienes carreras registradas</p>
                    <p className="text-sm text-muted-foreground text-center">
                        Agrega tu primera carrera para comenzar a trackear tu progreso
                    </p>
                </div>
                <AddEnrollmentButton onClick={handleAddEnrollment} />
            </>
        );
    }

    return (
        <>
            {/* <div className="space-y-6 pb-24"> */}
            <EnrollmentList
                enrollments={enrollments}
                selectedEnrollmentId={selectedEnrollmentId}
                onSelectEnrollment={handleSelectEnrollment}
            />
            {/* </div> */}
            {/* <AddEnrollmentButton onClick={handleAddEnrollment} /> */}
        </>
    );
}
