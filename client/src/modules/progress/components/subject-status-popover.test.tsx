import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SubjectStatusPopover } from './subject-status-popover';
import { SUBJECT_STATUS } from '../types';
import type { Subject } from '../types';

function mockSubject(overrides?: Partial<Subject>): Subject {
    return {
        id: '1',
        name: 'Test Subject',
        status: SUBJECT_STATUS.PENDING,
        year: 1,
        ...overrides,
    };
}

function renderPopover(subject: Subject, onSubjectChange = vi.fn()) {
    return render(
        <SubjectStatusPopover subject={subject} onSubjectChange={onSubjectChange}>
            <button type="button">Edit</button>
        </SubjectStatusPopover>,
    );
}

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('SubjectStatusPopover', () => {
    it('opens popover and shows status options', async () => {
        const user = userEvent.setup();
        renderPopover(mockSubject());

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        expect(screen.getByRole('tab', { name: 'Pendiente' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Cursando' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Aprobada' })).toBeInTheDocument();
    });

    it('shows grade input when approved is selected', async () => {
        const user = userEvent.setup();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }));

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });

        expect(screen.getByPlaceholderText(/Nota/i)).toBeInTheDocument();
    });

    it('hides grade input when switching to regular', async () => {
        const user = userEvent.setup();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }));

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });
        expect(screen.getByPlaceholderText(/Nota/i)).toBeInTheDocument();

        await user.click(screen.getByRole('tab', { name: 'Cursando' }));
        await act(async () => { await wait(100); });
        expect(screen.queryByPlaceholderText(/Nota/i)).not.toBeInTheDocument();
    });

    it('submits approved with grade', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }), onChange);

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });

        const gradeInput = screen.getByPlaceholderText(/Nota/i);
        await user.click(gradeInput);
        await user.type(gradeInput, '8');
        await user.tab();
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('button', { name: 'Guardar' }));
        await act(async () => { await wait(100); });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith({ status: SUBJECT_STATUS.APPROVED, grade: 8 });
    });

    it('submits regular and clears grade for previously approved subject', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.APPROVED, grade: 8 }), onChange);

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Cursando' }));
        await act(async () => { await wait(500); });

        console.log('DOM grade input:', screen.queryByPlaceholderText(/Nota/i));
        console.log('DOM HTML:', document.body.innerHTML.substring(0, 2000));

        await user.click(screen.getByRole('button', { name: 'Guardar' }));
        await act(async () => { await wait(500); });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith({ status: SUBJECT_STATUS.REGULAR, grade: undefined });
    });

    it('validates grade is required for approved (empty input)', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }), onChange);

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('button', { name: 'Guardar' }));
        await act(async () => { await wait(100); });

        expect(onChange).not.toHaveBeenCalled();
        const formMessage = document.querySelector('[data-slot="form-message"]');
        expect(formMessage).toBeInTheDocument();
        expect(formMessage).toHaveTextContent(/Invalid input|nota/i);
    });

    it('validates grade minimum bound for approved', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }), onChange);

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });

        const gradeInput = screen.getByPlaceholderText(/Nota/i);
        await user.clear(gradeInput);
        await user.type(gradeInput, '0');

        await user.click(screen.getByRole('button', { name: 'Guardar' }));
        await act(async () => { await wait(100); });

        expect(onChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.getByText(/nota mínima/i)).toBeInTheDocument());
    });

    it('validates grade maximum bound for approved', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderPopover(mockSubject({ status: SUBJECT_STATUS.PENDING }), onChange);

        await user.click(screen.getByRole('button', { name: 'Edit' }));
        await act(async () => { await wait(100); });

        await user.click(screen.getByRole('tab', { name: 'Aprobada' }));
        await act(async () => { await wait(100); });

        const gradeInput = screen.getByPlaceholderText(/Nota/i);
        await user.clear(gradeInput);
        await user.type(gradeInput, '11');

        await user.click(screen.getByRole('button', { name: 'Guardar' }));
        await act(async () => { await wait(100); });

        expect(onChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.getByText(/nota máxima/i)).toBeInTheDocument());
    });
});
