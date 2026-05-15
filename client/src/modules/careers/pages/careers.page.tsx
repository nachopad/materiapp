import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Search } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { CareerList } from '../components';

interface MockCareer {
    id: string;
    name: string;
    durationYears: number;
    totalSubjects: number;
}

// Mock data for development (remove when backend is ready)
const MOCK_CAREERS: Record<string, MockCareer[]> = {
    '1': [
        { id: 'c1', name: 'Ingeniería en Sistemas', durationYears: 5, totalSubjects: 42 },
        { id: 'c2', name: 'Licenciatura en Administración', durationYears: 4, totalSubjects: 35 },
        { id: 'c3', name: 'Abogacía', durationYears: 5, totalSubjects: 48 },
        { id: 'c4', name: 'Medicina', durationYears: 6, totalSubjects: 56 },
        { id: 'c5', name: 'Arquitectura', durationYears: 5, totalSubjects: 50 },
        { id: 'c6', name: 'Contador Público', durationYears: 4, totalSubjects: 38 },
    ],
    '2': [
        { id: 'c7', name: 'Ingeniería Civil', durationYears: 5, totalSubjects: 45 },
        { id: 'c8', name: 'Ingeniería Mecánica', durationYears: 5, totalSubjects: 44 },
        { id: 'c9', name: 'Ingeniería Eléctrica', durationYears: 5, totalSubjects: 43 },
        { id: 'c10', name: 'Ingeniería Química', durationYears: 5, totalSubjects: 46 },
    ],
    '3': [
        { id: 'c11', name: 'Tecnicatura en Programación', durationYears: 3, totalSubjects: 24 },
        { id: 'c12', name: 'Tecnicatura en Electrónica', durationYears: 3, totalSubjects: 26 },
        { id: 'c13', name: 'Ingeniería Industrial', durationYears: 5, totalSubjects: 48 },
    ],
};

// University names for display
const UNIVERSITY_NAMES: Record<string, string> = {
    '1': 'Universidad Nacional de La Plata',
    '2': 'Universidad de Buenos Aires',
    '3': 'Universidad Tecnológica Nacional',
};

/**
 * Get initials from university name (up to 2 characters).
 * Skips common Spanish connector words to get meaningful initials.
 */
function getInitials(name: string): string {
    const SKIP_WORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'un', 'una', 'unos', 'unas', 'y', 'e', 'o', 'u']);
    const words = name.trim().split(/\s+/).filter(w => !SKIP_WORDS.has(w.toLowerCase()));
    if (words.length === 0) {
        return name.slice(0, 2).toUpperCase();
    }
    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Careers page displaying a searchable list of careers for a specific university.
 */
export default function CareersPage({
    careersMap = MOCK_CAREERS,
    universityNames = UNIVERSITY_NAMES,
}: {
    careersMap?: Record<string, MockCareer[]>;
    universityNames?: Record<string, string>;
}) {
    const { universityId } = useParams<{ universityId: string }>();
    const [searchTerm, setSearchTerm] = useState('');

    const universityName = universityId ? universityNames[universityId] : null;
    const careers = universityId ? careersMap[universityId] || [] : [];

    const filteredCareers = careers.filter((career) => career.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Invalid university id state
    if (universityId && !universityName) {
        return (
            <>
                <MobilePageHeader title="Universidad no encontrada" showThemeToggle={false} />
                <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-muted-foreground text-center">No se encontró la universidad especificada.</p>
                        <Link to="/universities" className="text-sm text-primary hover:underline">
                            Volver a universidades
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Use abbreviation if available, otherwise derive from full name
    const universityDisplay = universityId ? universityNames[universityId] : null;
    const universityAbbreviation = universityDisplay
        ? getInitials(universityDisplay)
        : undefined;

    return (
        <>
            <MobilePageHeader
                title={universityAbbreviation ?? 'Carreras'}
                showThemeToggle={false}
                backHref="/universities"
            />
            <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Buscar carreras..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        iconPosition="left"
                        className="w-full"
                    />
                </div>

                {careers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-muted-foreground text-center">No hay carreras disponibles</p>
                        <p className="text-sm text-muted-foreground text-center">
                            Intenta más tarde para ver las carreras
                        </p>
                    </div>
                ) : filteredCareers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-muted-foreground text-center">No se encontraron carreras</p>
                        <p className="text-sm text-muted-foreground text-center">
                            Intenta con otro término de búsqueda
                        </p>
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="text-sm text-primary hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : (
                    <CareerList careers={filteredCareers} />
                )}
            </div>
        </>
    );
}
