import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SubjectNode } from './subject-node';
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

describe('SubjectNode', () => {
    it('renders subject name', () => {
        render(<SubjectNode subject={mockSubject({ name: 'Algebra II' })} />);
        expect(screen.getByText('Algebra II')).toBeInTheDocument();
    });

    it('does not render grade text on the node for approved subject with grade', () => {
        render(
            <SubjectNode
                subject={mockSubject({ status: SUBJECT_STATUS.APPROVED, grade: 9 })}
            />,
        );
        expect(screen.queryByText(/Nota:/i)).not.toBeInTheDocument();
        expect(screen.queryByText('9')).not.toBeInTheDocument();
    });

    it('renders as static article when onSubjectChange is not provided', () => {
        render(<SubjectNode subject={mockSubject()} />);
        expect(screen.getByText('Test Subject').closest('article')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Editar estado/i })).not.toBeInTheDocument();
    });

    it('renders as interactive button when onSubjectChange is provided', () => {
        render(<SubjectNode subject={mockSubject()} onSubjectChange={vi.fn()} />);
        expect(
            screen.getByRole('button', { name: /Test Subject: Pendiente\. Editar estado/i }),
        ).toBeInTheDocument();
    });

    it('opens popover when interactive node is clicked', async () => {
        const user = userEvent.setup();
        render(<SubjectNode subject={mockSubject()} onSubjectChange={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /Editar estado/i }));
        expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    });
});
