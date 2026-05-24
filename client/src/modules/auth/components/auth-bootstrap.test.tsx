import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthBootstrap } from './auth-bootstrap';

let mockStatus: 'idle' | 'loading' | 'authenticated' | 'anonymous' = 'idle';
const mockBootstrap = vi.fn();

vi.mock('@/modules/auth/store/auth.store', () => ({
	useAuthStore: (selector: (state: { status: string; bootstrap: () => void }) => unknown) =>
		selector({ status: mockStatus, bootstrap: mockBootstrap }),
}));

describe('auth-bootstrap', () => {
	beforeEach(() => {
		mockStatus = 'idle';
		vi.clearAllMocks();
	});

	it('renders loading spinner when status is idle', () => {
		const { container } = render(
			<AuthBootstrap>
				<div data-testid="children">Content</div>
			</AuthBootstrap>,
		);

		expect(container.querySelector('.animate-spin')).toBeInTheDocument();
		expect(screen.queryByTestId('children')).not.toBeInTheDocument();
	});

	it('renders loading spinner when status is loading', () => {
		mockStatus = 'loading';
		const { container } = render(
			<AuthBootstrap>
				<div data-testid="children">Content</div>
			</AuthBootstrap>,
		);

		expect(container.querySelector('.animate-spin')).toBeInTheDocument();
		expect(screen.queryByTestId('children')).not.toBeInTheDocument();
	});

	it('renders children when status is authenticated', () => {
		mockStatus = 'authenticated';
		const { container } = render(
			<AuthBootstrap>
				<div data-testid="children">Content</div>
			</AuthBootstrap>,
		);

		expect(screen.getByTestId('children')).toBeInTheDocument();
		expect(container.querySelector('.animate-spin')).toBeNull();
	});

	it('renders children when status is anonymous', () => {
		mockStatus = 'anonymous';
		const { container } = render(
			<AuthBootstrap>
				<div data-testid="children">Content</div>
			</AuthBootstrap>,
		);

		expect(screen.getByTestId('children')).toBeInTheDocument();
		expect(container.querySelector('.animate-spin')).toBeNull();
	});

	it('calls bootstrap once on mount', () => {
		render(
			<AuthBootstrap>
				<div data-testid="children">Content</div>
			</AuthBootstrap>,
		);

		expect(mockBootstrap).toHaveBeenCalledTimes(1);
	});
});
