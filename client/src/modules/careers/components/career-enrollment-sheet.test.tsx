import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CareerEnrollmentSheet } from './career-enrollment-sheet';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';

// Helper to render sheet in open state
const renderSheet = (careerId = 'c1', careerName = 'Ingeniería en Sistemas') => {
    const onOpenChange = vi.fn();
    const result = render(
        <CareerEnrollmentSheet
            careerId={careerId}
            careerName={careerName}
            open={true}
            onOpenChange={onOpenChange}
        />
    );
    return { ...result, onOpenChange };
};

// Helper to reset store before each test
const resetStore = () => {
    useEnrollmentsStore.setState({ enrolledCareerIds: [] });
};

describe('CareerEnrollmentSheet', () => {
    beforeEach(() => {
        resetStore();
    });

    it('renders with full date mode by default', () => {
        renderSheet();

        expect(screen.getByLabelText(/Fecha de inscripción/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirmar inscripción' })).toBeInTheDocument();
    });

    it('switches to month/year mode when selected', async () => {
        const user = userEvent.setup();
        renderSheet();

        const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
        if (monthYearLabel) {
            await user.click(monthYearLabel);
        }

        expect(screen.getByLabelText(/Mes y año de inscripción/i)).toBeInTheDocument();
    });

    describe('Mode exclusivity', () => {
        it('preserves fullDate value when switching to monthYear mode', async () => {
            const user = userEvent.setup();
            renderSheet();

            // Enter a full date value first using fireEvent (more reliable for date inputs in jsdom)
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;
            fireEvent.change(fullDateInput, { target: { value: '2024-03-15' } });

            // Verify the value was entered
            expect(fullDateInput.value).toBe('2024-03-15');

            // Switch to month/year mode
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // Month/year should be visible
            expect(screen.getByLabelText(/Mes y año de inscripción/i)).toBeInTheDocument();

            // When we switch back to fullDate, the value should be preserved
            const fullDateLabel = document.querySelector('label:has(input[value="fullDate"])');
            if (fullDateLabel) {
                await user.click(fullDateLabel);
            }
            const revivedFullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;
            expect(revivedFullDateInput.value).toBe('2024-03-15');
        });

        it('preserves monthYear value when switching to fullDate mode', async () => {
            const user = userEvent.setup();
            renderSheet();

            // Switch to month/year mode first
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // Enter a month/year value
            const monthYearInput = screen.getByLabelText(/Mes y año de inscripción/i) as HTMLInputElement;
            fireEvent.change(monthYearInput, { target: { value: '2024-03' } });

            // Verify the value was entered
            expect(monthYearInput.value).toBe('2024-03');

            // Switch back to full date mode
            const fullDateLabel = document.querySelector('label:has(input[value="fullDate"])');
            if (fullDateLabel) {
                await user.click(fullDateLabel);
            }

            // Full date should be visible
            expect(screen.getByLabelText(/Fecha de inscripción/i)).toBeInTheDocument();

            // When we switch back to month/year, the value should be preserved
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }
            const revivedMonthYearInput = screen.getByLabelText(/Mes y año de inscripción/i) as HTMLInputElement;
            expect(revivedMonthYearInput.value).toBe('2024-03');
        });

        it('preserves opposite input value when switching modes', async () => {
            const user = userEvent.setup();
            renderSheet();

            // Full date mode: enter a date
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;
            fireEvent.change(fullDateInput, { target: { value: '2024-06-15' } });

            // Switch to month/year
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // The month/year input should be empty (we just switched to it)
            const monthYearInput = screen.getByLabelText(/Mes y año de inscripción/i) as HTMLInputElement;
            expect(monthYearInput.value).toBe('');

            // Switch back and verify fullDate value is preserved
            const fullDateLabel = document.querySelector('label:has(input[value="fullDate"])');
            if (fullDateLabel) {
                await user.click(fullDateLabel);
            }
            expect(fullDateInput.value).toBe('2024-06-15'); // Value is preserved
        });
    });

    it('renders month/year input when month/year mode is selected', async () => {
        const user = userEvent.setup();
        renderSheet();

        // Switch to month/year mode
        const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
        if (monthYearLabel) {
            await user.click(monthYearLabel);
        }

        expect(screen.getByLabelText(/Mes y año de inscripción/i)).toBeInTheDocument();
    });

    it('closes sheet when cancel is clicked', async () => {
        const user = userEvent.setup();
        const { onOpenChange } = renderSheet();

        const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
        await user.click(cancelButton);

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('can be closed with escape key', async () => {
        const user = userEvent.setup();
        const { onOpenChange } = renderSheet();

        await user.keyboard('{Escape}');

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('renders sheet title with career name', () => {
        renderSheet('c1', 'Ingeniería en Sistemas');

        expect(screen.getByText('Inscribirse en Ingeniería en Sistemas')).toBeInTheDocument();
    });

    it('mode toggle switches input fields and preserves opposite value', async () => {
        const user = userEvent.setup();
        renderSheet();

        // Enter a fullDate value first
        const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;
        fireEvent.change(fullDateInput, { target: { value: '2024-06-15' } });
        expect(fullDateInput.value).toBe('2024-06-15');

        // Switch to monthYear mode
        const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
        if (monthYearLabel) {
            await user.click(monthYearLabel);
        }

        // Month/year input should now be visible and empty (we just switched to it)
        const monthYearInput = screen.getByLabelText(/Mes y año de inscripción/i) as HTMLInputElement;
        expect(monthYearInput.value).toBe('');

        // Switch back to fullDate - value should be preserved
        const fullDateLabel = document.querySelector('label:has(input[value="fullDate"])') as HTMLLabelElement;
        if (fullDateLabel) {
            await user.click(fullDateLabel);
        }
        expect(fullDateInput.value).toBe('2024-06-15');
    });

    describe('Mixed/invalid input validation', () => {
        it('submit button is disabled when form has no date value (fullDate mode)', () => {
            resetStore();
            renderSheet();

            const submitButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            // Button should be disabled because no valid date was entered
            expect(submitButton).toBeDisabled();
        });

        it('submit button is disabled when form has no date value (monthYear mode)', async () => {
            resetStore();
            const user = userEvent.setup();
            renderSheet();

            // Switch to month/year mode
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            const submitButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Confirm enrollment behavior', () => {
        it('renders the enrollment form with all required fields and starts invalid', () => {
            resetStore();
            renderSheet();

            // Form elements are present
            expect(screen.getByRole('button', { name: 'Confirmar inscripción' })).toBeInTheDocument();
            expect(screen.getByLabelText(/Fecha de inscripción/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Modo de fecha/i)).toBeInTheDocument();

            // Form starts in invalid state since no date is entered
            const submitButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            expect(submitButton).toBeDisabled();
        });

        it('can switch to month/year mode', async () => {
            resetStore();
            const user = userEvent.setup();
            renderSheet();

            // Click month/year label to switch modes
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // Month/year input should now be visible
            expect(screen.getByLabelText(/Mes y año de inscripción/i)).toBeInTheDocument();
        });

        it('cancel and confirm buttons have distinct actions', async () => {
            const user = userEvent.setup();
            const { onOpenChange } = renderSheet();

            // Get the date input and type character by character (like working submit tests)
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;
            await user.click(fullDateInput);
            await waitForTimeout(50);

            // Clear any existing value and type new value
            await user.clear(fullDateInput);
            for (const char of '2024-06-15') {
                await user.type(fullDateInput, char);
                await waitForTimeout(10);
            }

            // Trigger blur to run validation (sheet form uses onBlur mode)
            await user.tab();

            // Flush all pending updates
            await act(async () => { await waitForTimeout(300); });

            // Confirm should be enabled with valid date
            const confirmButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            expect(confirmButton).toBeEnabled();

            // Cancel button closes without enrolling
            const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
            await user.click(cancelButton);

            expect(onOpenChange).toHaveBeenCalledWith(false);
            expect(useEnrollmentsStore.getState().isEnrolled('c1')).toBe(false);
        });
    });

    describe('Keyboard activation and navigation', () => {
        it('renders radios that are keyboard accessible', () => {
            renderSheet();

            // The radios should be present
            const fullDateRadio = document.querySelector('input[value="fullDate"]');
            const monthYearRadio = document.querySelector('input[value="monthYear"]');

            expect(fullDateRadio).toBeInTheDocument();
            expect(monthYearRadio).toBeInTheDocument();

            // Radios should be in a radiogroup
            const radiogroup = document.querySelector('[role="radiogroup"]');
            expect(radiogroup).toBeInTheDocument();
        });

        it('cancel button closes the sheet', async () => {
            resetStore();
            const user = userEvent.setup();
            const { onOpenChange } = renderSheet();

            await user.click(screen.getByRole('button', { name: 'Cancelar' }));

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it('escape key closes the sheet', async () => {
            resetStore();
            const user = userEvent.setup();
            const { onOpenChange } = renderSheet();

            await user.keyboard('{Escape}');

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    describe('Focus management', () => {
        it('focuses first input when sheet opens', async () => {
            renderSheet();

            // Give time for the setTimeout in the effect to fire
            await waitForTimeout(150);

            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i);
            expect(document.activeElement).toBe(fullDateInput);
        });

        it('focus moves to first field after mode switch', async () => {
            const user = userEvent.setup();
            renderSheet();

            // Switch to month/year mode
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // Give time for re-focus
            await waitForTimeout(150);

            const monthYearInput = screen.getByLabelText(/Mes y año de inscripción/i);
            expect(document.activeElement).toBe(monthYearInput);
        });
    });

    describe('Submit path coverage', () => {
        it('enrolls successfully with fullDate mode via form submit', async () => {
            const user = userEvent.setup();
            renderSheet('c1', 'Ingeniería en Sistemas');

            // Get the date input
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i) as HTMLInputElement;

            // Click to focus, then type character by character
            await user.click(fullDateInput);
            await waitForTimeout(50);

            // Clear any existing value and type new value
            await user.clear(fullDateInput);
            // Type character by character to trigger react-hook-form onChange
            for (const char of '2024-03-15') {
                await user.type(fullDateInput, char);
                await waitForTimeout(10);
            }

            // Trigger blur to run validation (sheet form uses onBlur mode)
            await user.tab();

            // Flush all pending updates
            await act(async () => { await waitForTimeout(300); });

            // Verify the input has the correct value
            expect(fullDateInput.value).toBe('2024-03-15');

            // Click submit button - this exercises the real onSubmit path
            const submitButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            await user.click(submitButton);

            await act(async () => { await waitForTimeout(200); });

            // Verify store was updated via real form submission
            const state = useEnrollmentsStore.getState();
            expect(state.isEnrolled('c1')).toBe(true);
            expect(state.enrolledCareerIds).toContain('c1');
        });

        it('enrolls successfully with month/year mode via form submit', async () => {
            const user = userEvent.setup();
            renderSheet('c2', 'Licenciatura en Administración');

            // Switch to month/year mode
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])');
            if (monthYearLabel) {
                await user.click(monthYearLabel);
            }

            // Get the month/year input
            const monthYearInput = screen.getByLabelText(/Mes y año de inscripción/i) as HTMLInputElement;
            await user.click(monthYearInput);
            await waitForTimeout(50);
            await user.clear(monthYearInput);

            // Type character by character
            for (const char of '2024-06') {
                await user.type(monthYearInput, char);
                await waitForTimeout(10);
            }

            // Trigger blur to run validation (sheet form uses onBlur mode)
            await user.tab();

            // Flush all pending updates
            await act(async () => { await waitForTimeout(300); });

            // Verify the input has the correct value
            expect(monthYearInput.value).toBe('2024-06');

            // Click submit button - this exercises the real onSubmit path
            const submitButton = screen.getByRole('button', { name: 'Confirmar inscripción' });
            await user.click(submitButton);

            await act(async () => { await waitForTimeout(200); });

            // Verify store was updated via real form submission
            const state = useEnrollmentsStore.getState();
            expect(state.isEnrolled('c2')).toBe(true);
            expect(state.enrolledCareerIds).toContain('c2');
        });
    });

    describe('Store integration (direct calls)', () => {
        it('enroll function updates enrolledCareerIds correctly', () => {
            resetStore();

            const initialState = useEnrollmentsStore.getState();
            expect(initialState.enrolledCareerIds).toHaveLength(0);

            useEnrollmentsStore.getState().enroll('c1', { mode: 'fullDate', value: '2024-03-15' });

            const afterEnroll = useEnrollmentsStore.getState();
            expect(afterEnroll.enrolledCareerIds).toContain('c1');
            expect(afterEnroll.isEnrolled('c1')).toBe(true);
        });

        it('isEnrolled returns true for enrolled career', () => {
            resetStore();

            useEnrollmentsStore.getState().enroll('c1', { mode: 'fullDate', value: '2024-03-15' });

            expect(useEnrollmentsStore.getState().isEnrolled('c1')).toBe(true);
            expect(useEnrollmentsStore.getState().isEnrolled('c999')).toBe(false);
        });

        it('prevents double enrollment (idempotent)', () => {
            resetStore();

            useEnrollmentsStore.getState().enroll('c1', { mode: 'fullDate', value: '2024-03-15' });
            useEnrollmentsStore.getState().enroll('c1', { mode: 'monthYear', value: '2024-06' });

            const state = useEnrollmentsStore.getState();
            const c1Count = state.enrolledCareerIds.filter(id => id === 'c1').length;
            expect(c1Count).toBe(1);
        });
    });
});

// Helper function for async timeout
function waitForTimeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
