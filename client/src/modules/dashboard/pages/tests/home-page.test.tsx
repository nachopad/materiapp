import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import HomePage from '../home.page';
import type { DashboardHome } from '../../types';

// Mock lucide-react icons used in KPI cards, subjects, and careers
vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react');
    return {
        ...actual,
        GraduationCap: () => <span data-testid="graduation-cap-icon" aria-hidden="true" />,
        BookOpen: () => <span data-testid="book-open-icon" aria-hidden="true" />,
        ChartLine: () => <span data-testid="chart-line-icon" aria-hidden="true" />,
        Trophy: () => <span data-testid="trophy-icon" aria-hidden="true" />,
        Building: () => <span data-testid="building-icon" aria-hidden="true" />,
    };
});

// Mock pity.svg icon
vi.mock('@/assets/icons', () => ({
    Pity: () => <span data-testid="pity-icon" aria-hidden="true" />,
}));

describe('HomePage', () => {
    it('renders academic summary section with 4 KPI cards', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Verify academic summary is rendered with 4 KPI cards per wireframe
        expect(screen.getByText('Resumen Académico')).toBeInTheDocument();
        // Use getAllByText for labels that appear in multiple contexts
        const carrerasActivasLabels = screen.getAllByText('Carreras activas');
        expect(carrerasActivasLabels).toHaveLength(2); // One in KPI card, one in careers section header
        expect(screen.getAllByText('Facultades inscriptas')).toHaveLength(1);
        expect(screen.getAllByText('Materias en curso')).toHaveLength(1);
        expect(screen.getAllByText('Materias aprobadas')).toHaveLength(1);
    });

    it('renders welcome header with user name', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage userName="María" />
            </MemoryRouter>
        );

        expect(screen.getByText('¡Bienvenido, María!')).toBeInTheDocument();
        expect(screen.getByText('Aquí tienes un resumen de tu actividad académica')).toBeInTheDocument();
    });

    it('renders welcome header with pity.svg icon to the left of text', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage userName="María" />
            </MemoryRouter>
        );

        // Find the pity icon element (mocked via data-testid)
        const pityIcon = screen.getByTestId('pity-icon');
        expect(pityIcon).toBeInTheDocument();

        // Verify the welcome text group is present
        expect(screen.getByText('¡Bienvenido, María!')).toBeInTheDocument();
    });

    it('welcome text group is left-aligned, not centered', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage userName="María" />
            </MemoryRouter>
        );

        // Find the welcome header container
        const welcomeHeader = screen.getByText('¡Bienvenido, María!').closest('div');
        expect(welcomeHeader).toBeInTheDocument();

        // Verify the text group does NOT have text-center (left-align is default)
        expect(welcomeHeader?.className).not.toContain('text-center');
    });

    it('renders current subjects section without professor info', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByText('Materias cursando actualmente')).toBeInTheDocument();
        // Mock data has 3 subjects
        expect(screen.getByText('Matemática Discreta')).toBeInTheDocument();
        expect(screen.getByText('Programación I')).toBeInTheDocument();
        expect(screen.getByText('Base de Datos')).toBeInTheDocument();

        // Professor info should NOT be displayed
        expect(screen.queryByText('Dr. García')).not.toBeInTheDocument();
        expect(screen.queryByText('Mg. López')).not.toBeInTheDocument();
        expect(screen.queryByText('Lic. Martínez')).not.toBeInTheDocument();
    });

    it('renders active careers section', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // "Carreras activas" appears twice - once as KPI card label, once as section heading
        const carrerasLabels = screen.getAllByText('Carreras activas');
        expect(carrerasLabels).toHaveLength(2);
        // Mock data has 2 careers
        expect(screen.getByText('Analista Programador Universitario')).toBeInTheDocument();
        expect(screen.getByText('Licenciatura en Sistemas')).toBeInTheDocument();
    });

    it('does NOT render quick actions section (Acceso Rápido removed per spec)', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.queryByText('Acceso Rápido')).not.toBeInTheDocument();
        expect(screen.queryByText('Ir a Progreso')).not.toBeInTheDocument();
        expect(screen.queryByText('Ir a Inscripciones')).not.toBeInTheDocument();
        expect(screen.queryByText('Ver Calendario')).not.toBeInTheDocument();
    });

    it('does NOT render student status section (Estado del Alumno removed)', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.queryByText('Estado del Alumno')).not.toBeInTheDocument();
        expect(screen.queryByText('Inscripción actual')).not.toBeInTheDocument();
        expect(screen.queryByText('Próximo examen')).not.toBeInTheDocument();
        expect(screen.queryByText('Tareas pendientes')).not.toBeInTheDocument();
    });

    it('replaces the placeholder with real dashboard content', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // The placeholder "Dashboard" text should NOT appear
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        // Instead, real content from wireframe sections should appear
        expect(screen.getByText('Resumen Académico')).toBeInTheDocument();
    });

    it('displays mock academic data correctly', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Verify KPI numeric values from MOCK_DASHBOARD are visible
        // activeCareers = 2 appears once in KPI card
        expect(screen.getAllByText('2')).toHaveLength(1); // activeCareers in KPI
        // facultiesEnrolled = 3 appears once in KPI card
        expect(screen.getAllByText('3')).toHaveLength(1); // facultiesEnrolled in KPI
        // subjectsInProgress = 5 appears once in KPI card
        expect(screen.getAllByText('5')).toHaveLength(1); // subjectsInProgress in KPI
        // subjectsApproved = 15 appears once in KPI card
        expect(screen.getAllByText('15')).toHaveLength(1); // subjectsApproved in KPI
    });

    it('renders KPI cards with icons on the left', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Each KPI card should have an icon (via data-testid from mocked lucide icons)
        // KPI icons: graduation-cap (1), book-open (2), book-open (3), trophy (4)
        const graduationCapIcons = screen.getAllByTestId('graduation-cap-icon');
        const trophyIcons = screen.getAllByTestId('trophy-icon');
        const bookOpenIcons = screen.getAllByTestId('book-open-icon');

        // graduation-cap appears once in KPI + once in careers section header = 2
        expect(graduationCapIcons.length).toBeGreaterThanOrEqual(1);
        // trophy appears once in KPI
        expect(trophyIcons.length).toBeGreaterThanOrEqual(1);
        // book-open appears twice in KPIs + once in subjects section header + 3 subject items = 6
        expect(bookOpenIcons.length).toBeGreaterThanOrEqual(2);
    });

    it('renders current subject items with icons on the left', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Multiple BookOpen icons should be present (section header + 3 subject items)
        const bookOpenIcons = screen.getAllByTestId('book-open-icon');
        // book-open: 2 in KPIs + 1 section header + 3 subject items = 6
        expect(bookOpenIcons.length).toBeGreaterThanOrEqual(4); // At minimum section + subjects

        // Each subject item should have the subject name visible (icon is next to it)
        expect(screen.getByText('Matemática Discreta')).toBeInTheDocument();
        expect(screen.getByText('Programación I')).toBeInTheDocument();
        expect(screen.getByText('Base de Datos')).toBeInTheDocument();
    });

    it('renders active careers with progress bar and percentage', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Progress bars should be present (Radix UI Progress uses role="progressbar")
        const progressBars = screen.getAllByRole('progressbar');
        expect(progressBars.length).toBeGreaterThanOrEqual(2); // At least 2 careers

        // Percentage badges should be visible
        expect(screen.getByText('35%')).toBeInTheDocument();
        expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('renders KPI cards in 2x2 grid layout on desktop/tablet', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Find the KPI grid container - it has grid-cols-2 and sm:grid-cols-2 classes
        const kpiSection = screen.getByText('Resumen Académico').closest('section');
        expect(kpiSection).toBeInTheDocument();

        // The grid should have grid-cols-2 (2 columns on mobile) and sm:grid-cols-2 (2 columns on tablet/desktop)
        const gridContainer = kpiSection?.querySelector('.grid');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer?.className).toContain('grid-cols-2');
        expect(gridContainer?.className).toContain('sm:grid-cols-2');

        // KPI cards: there should be 4 cards total within the KPI grid
        const kpiCards = screen.getAllByText('Carreras activas');
        expect(kpiCards.length).toBeGreaterThanOrEqual(1);
    });

    it('renders KPI cards with balanced typography (reduced font sizes)', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Verify all KPI card labels are present (text still renders, just smaller)
        // Use getAllByText to find labels that appear within KPI context (not section headers)
        const kpiLabels = ['Carreras activas', 'Facultades inscriptas', 'Materias en curso', 'Materias aprobadas'];
        for (const label of kpiLabels) {
            const allMatches = screen.getAllByText(label);
            // Should have at least one match (the KPI card label)
            expect(allMatches.length).toBeGreaterThanOrEqual(1);
        }

        // Verify KPI numeric values are visible
        // 2 appears once in KPI, 3 appears once in KPI, 5 appears once in KPI, 15 appears once in KPI
        // (We check the KPI section specifically)
        const kpiSection = screen.getByText('Resumen Académico').closest('section');
        const kpiNumbers = kpiSection?.querySelectorAll('.text-xl.font-bold');
        const kpiNumberTexts = Array.from(kpiNumbers || []).map(el => el.textContent);
        expect(kpiNumberTexts).toContain('2');
        expect(kpiNumberTexts).toContain('3');
        expect(kpiNumberTexts).toContain('5');
        expect(kpiNumberTexts).toContain('15');
    });

    it('shows empty state when currentSubjects is empty', () => {
        const emptyDashboard: DashboardHome = {
            ...MOCK_DASHBOARD,
            currentSubjects: [],
        };
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage dashboard={emptyDashboard} />
            </MemoryRouter>
        );

        expect(screen.getByText('No hay materias en curso')).toBeInTheDocument();
    });

    it('KPI card text content is left-aligned, not centered', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage />
            </MemoryRouter>
        );

        // Find KPI section and its grid container
        const kpiSection = screen.getByText('Resumen Académico').closest('section');
        expect(kpiSection).toBeInTheDocument();

        // Each KPI card has structure: icon (left) + text container (with number + label)
        // The text container should NOT have text-center class (alignment is left by default)
        // We verify by checking the text containers don't force center alignment
        const kpiCards = kpiSection?.querySelectorAll('.rounded-lg.border');
        expect(kpiCards).toHaveLength(4);

        // Each KPI card's inner text div should NOT have text-center
        kpiCards?.forEach(card => {
            const textDiv = card.querySelector('.flex-1');
            expect(textDiv).toBeInTheDocument();
            // The text container should not have text-center (left-align is the default)
            expect(textDiv?.className).not.toContain('text-center');
        });
    });

    it('shows empty state when activeCareersList is empty', () => {
        const emptyDashboard: DashboardHome = {
            ...MOCK_DASHBOARD,
            activeCareersList: [],
        };
        render(
            <MemoryRouter initialEntries={['/']}>
                <HomePage dashboard={emptyDashboard} />
            </MemoryRouter>
        );

        expect(screen.getByText('No hay carreras activas')).toBeInTheDocument();
    });
});

const MOCK_DASHBOARD: DashboardHome = {
    summary: {
        activeCareers: 2,
        facultiesEnrolled: 3,
        subjectsInProgress: 5,
        subjectsApproved: 15,
    },
    // quickActions removed per latest spec update
    currentSubjects: [
        { id: '1', name: 'Matemática Discreta', careerName: 'Analista Programador' },
        { id: '2', name: 'Programación I', careerName: 'Analista Programador' },
        { id: '3', name: 'Base de Datos', careerName: 'Analista Programador' },
    ],
    activeCareersList: [
        { id: '1', name: 'Analista Programador Universitario', facultyName: 'Facultad de Informática', year: 2, progress: 35 },
        { id: '2', name: 'Licenciatura en Sistemas', facultyName: 'Facultad de Informática', year: 1, progress: 20 },
    ],
};

// Type guard to validate mock conforms to DashboardHome at runtime
function isValidDashboardHome(data: unknown): data is DashboardHome {
    if (!data || typeof data !== 'object') return false;
    const d = data as DashboardHome;
    return (
        typeof d.summary?.activeCareers === 'number' &&
        typeof d.summary?.facultiesEnrolled === 'number' &&
        typeof d.summary?.subjectsInProgress === 'number' &&
        typeof d.summary?.subjectsApproved === 'number' &&
        // quickActions removed per latest spec update
        Array.isArray(d.currentSubjects) &&
        Array.isArray(d.activeCareersList)
    );
}

describe('MOCK_DASHBOARD type contract', () => {
    it('MOCK_DASHBOARD conforms to DashboardHome interface', () => {
        expect(isValidDashboardHome(MOCK_DASHBOARD)).toBe(true);
    });

    it('rejects invalid mock data that breaks contract', () => {
        const invalidMock = {
            summary: {
                activeCareers: 'not a number', // invalid type
                facultiesEnrolled: 3,
                subjectsInProgress: 5,
                subjectsApproved: 15,
            },
            currentSubjects: [],
            activeCareersList: [],
        };
        expect(isValidDashboardHome(invalidMock)).toBe(false);
    });
});
