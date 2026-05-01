import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CareerEnrollmentForm } from './career-enrollment-form';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';

// Helper to render form
const renderForm = (careerId = 'c1', careerName = 'Ingeniería en Sistemas') => {
    const onSuccess = vi.fn();
    const result = render(
        <CareerEnrollmentForm
            careerId={careerId}
            careerName={careerName}
            onSuccess={onSuccess}
        />
    );
    return { ...result, onSuccess };
};

// Helper to reset store before each test
const resetStore = () => {
    useEnrollmentsStore.setState({ enrolledCareerIds: [] });
};

// Helper for async timeout
function waitForTimeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('CareerEnrollmentForm', () => {
    beforeEach(() => {
        resetStore();
    });

    describe('Toggle persistence', () => {
        it('switches to monthYear and persists through form state', async () => {
            const user = userEvent.setup();
            renderForm();

            // Initial state should show fullDate input
            expect(screen.getByLabelText(/Fecha de inscripción/i)).toBeInTheDocument();

            // Click the label containing monthYear radio (not the radio directly)
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            // After switching, monthYear input should be visible
            expect(screen.getByLabelText(/Mes y año/i)).toBeInTheDocument();
        });

        it('does not auto-revert mode after field interaction', async () => {
            const user = userEvent.setup();
            renderForm();

            // Switch to monthYear by clicking label
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            // Enter a value in the monthYear field
            const monthInput = screen.getByLabelText(/Mes y año/i);
            await user.click(monthInput);
            await user.type(monthInput, '2024-06');

            await act(async () => { await waitForTimeout(100); });

            // monthYear input should still be visible (mode didn't revert)
            expect(screen.getByLabelText(/Mes y año/i)).toBeInTheDocument();
        });

        it('persists mode selection after entering fullDate value', async () => {
            const user = userEvent.setup();
            renderForm();

            // Enter a fullDate value first
            const dateInput = screen.getByLabelText(/Fecha de inscripción/i);
            await user.click(dateInput);
            await user.type(dateInput, '2024-03-15');

            await act(async () => { await waitForTimeout(100); });

            // Switch to monthYear by clicking label
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            // monthYear input should be visible
            expect(screen.getByLabelText(/Mes y año/i)).toBeInTheDocument();
        });
    });

    describe('Active-mode validation', () => {
        it('validates only active field in fullDate mode', async () => {
            const user = userEvent.setup();
            renderForm();

            // FullDate mode is default - enter a valid date
            const dateInput = screen.getByLabelText(/Fecha de inscripción/i);
            await user.click(dateInput);
            await user.type(dateInput, '2024-03-15');

            await act(async () => { await waitForTimeout(100); });

            // Submit button should be enabled
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeEnabled();
        });

        it('validates only active field in monthYear mode', async () => {
            const user = userEvent.setup();
            renderForm();

            // Switch to monthYear mode by clicking label
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            // Enter valid monthYear
            const monthInput = screen.getByLabelText(/Mes y año/i);
            await user.click(monthInput);
            await user.type(monthInput, '2024-06');

            await act(async () => { await waitForTimeout(100); });

            // Submit button should be enabled
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeEnabled();
        });

        it('preserves existing fullDate success path', async () => {
            const user = userEvent.setup();
            renderForm();

            // Enter valid fullDate
            const dateInput = screen.getByLabelText(/Fecha de inscripción/i);
            await user.click(dateInput);
            await user.type(dateInput, '2024-03-15');
            await user.tab();

            await act(async () => { await waitForTimeout(200); });

            // Submit should work without errors
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeEnabled();
        });
    });

    describe('FormMessage rendering', () => {
        it('shows error through FormMessage when submitting with empty field', async () => {
            const user = userEvent.setup();
            renderForm();

            // Enter a value then clear it to trigger validation error
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i);
            await user.click(fullDateInput);
            await user.type(fullDateInput, '2024-03-15');
            await user.clear(fullDateInput);
            // blur to trigger validation since form uses onChange mode
            await user.tab();

            await act(async () => { await waitForTimeout(200); });

            // Verify FormMessage shows validation error
            const formMessage = document.querySelector('[data-slot="form-message"]');
            expect(formMessage).toBeInTheDocument();
        });

        it('disables submit when switching to monthYear without entering value', async () => {
            const user = userEvent.setup();
            renderForm();

            // Switch to monthYear mode by clicking label (no value entered)
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(200); });

            // Submit button should be disabled
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Confirm button enablement', () => {
        it('confirm button is disabled when no date is entered (fullDate mode)', () => {
            renderForm();

            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeDisabled();
        });

        it('confirm button remains disabled when switching to monthYear mode without entering value', async () => {
            const user = userEvent.setup();
            renderForm();

            // Switch to month/year mode by clicking label
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Error message behavior', () => {
        it('error clears when valid fullDate is entered', async () => {
            const user = userEvent.setup();
            renderForm();

            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i);

            await user.click(fullDateInput);
            await user.clear(fullDateInput);
            await user.type(fullDateInput, '2024-03-15');
            await user.tab();

            await act(async () => { await waitForTimeout(200); });

            // Confirm button should be enabled
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            expect(submitButton).toBeEnabled();

            // No error should be shown with valid date
            const formMessage = document.querySelector('[data-slot="form-message"]');
            expect(formMessage).not.toBeInTheDocument();
        });
    });

    describe('Submit path coverage', () => {
        it('enrolls with fullDate data when form is submitted', async () => {
            const user = userEvent.setup();
            renderForm();

            // Enter valid fullDate
            const fullDateInput = screen.getByLabelText(/Fecha de inscripción/i);
            await user.click(fullDateInput);
            await user.type(fullDateInput, '2024-03-15');
            await user.tab();

            await act(async () => { await waitForTimeout(200); });

            // Click submit button
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            await user.click(submitButton);

            await act(async () => { await waitForTimeout(200); });

            // Verify enrollment happened
            const state = useEnrollmentsStore.getState();
            expect(state.isEnrolled('c1')).toBe(true);
            expect(state.enrolledCareerIds).toContain('c1');
        });

        it('enrolls with monthYear data when form is submitted', async () => {
            const user = userEvent.setup();
            renderForm();

            // Switch to monthYear
            const monthYearLabel = document.querySelector('label:has(input[value="monthYear"])') as HTMLLabelElement;
            await user.click(monthYearLabel);

            await act(async () => { await waitForTimeout(100); });

            // Enter valid monthYear
            const monthInput = screen.getByLabelText(/Mes y año/i);
            await user.click(monthInput);
            await user.type(monthInput, '2024-06');
            await user.tab();

            await act(async () => { await waitForTimeout(200); });

            // Click submit button
            const submitButton = screen.getByRole('button', { name: 'Confirmar' });
            await user.click(submitButton);

            await act(async () => { await waitForTimeout(200); });

            // Verify enrollment happened
            const state = useEnrollmentsStore.getState();
            expect(state.isEnrolled('c1')).toBe(true);
            expect(state.enrolledCareerIds).toContain('c1');
        });
    });

    describe('Successful enrollment via store', () => {
        it('enroll function updates enrolledCareerIds correctly', () => {
            resetStore();

            useEnrollmentsStore.getState().enroll('c1', { mode: 'fullDate', value: '2024-03-15' });

            const state = useEnrollmentsStore.getState();
            expect(state.isEnrolled('c1')).toBe(true);
            expect(state.enrolledCareerIds).toContain('c1');
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

    describe('Cancel button', () => {
        it('cancel button calls onSuccess without enrolling', async () => {
            const user = userEvent.setup();
            const { onSuccess } = renderForm();

            const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
            await user.click(cancelButton);

            expect(onSuccess).toHaveBeenCalledTimes(1);
            expect(useEnrollmentsStore.getState().isEnrolled('c1')).toBe(false);
        });
    });
});