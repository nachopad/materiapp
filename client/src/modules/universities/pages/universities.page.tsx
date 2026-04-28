import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { UniversityListCard } from '../components';

interface MockUniversity {
    id: string;
    name: string;
    careersCount: number;
}

export type { MockUniversity };

// Mock data for development (remove when backend is ready)
const MOCK_UNIVERSITIES: MockUniversity[] = [
    { id: '1', name: 'Universidad Nacional de La Plata', careersCount: 12 },
    { id: '2', name: 'Universidad de Buenos Aires', careersCount: 24 },
    { id: '3', name: 'Universidad Tecnológica Nacional', careersCount: 8 },
    { id: '4', name: 'Universidad Nacional de Córdoba', careersCount: 18 },
    { id: '5', name: 'Universidad Nacional de Tucumán', careersCount: 15 },
    { id: '6', name: 'Universidad Nacional de Rosario', careersCount: 14 },
    { id: '7', name: 'Universidad Nacional del Litoral', careersCount: 10 },
    { id: '8', name: 'Universidad Nacional de Mendoza', careersCount: 9 },
];

/**
 * Universities page displaying a searchable list of universities.
 */
export default function UniversitiesPage({ universities = MOCK_UNIVERSITIES }: { universities?: MockUniversity[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUniversities = universities.filter((university) =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <>
            <MobilePageHeader title="Universidades" showThemeToggle={false} />
            <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Buscar universidades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                        iconPosition="left"
                        className="w-full"
                    />
                </div>

                {universities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-muted-foreground text-center">No hay universidades disponibles</p>
                        <p className="text-sm text-muted-foreground text-center">
                            Intenta más tarde para ver las universidades
                        </p>
                    </div>
                ) : filteredUniversities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <p className="text-muted-foreground text-center">No se encontraron universidades</p>
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
                    <div className="space-y-3">
                        {filteredUniversities.map((university) => (
                            <UniversityListCard
                                key={university.id}
                                name={university.name}
                                careersCount={university.careersCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
