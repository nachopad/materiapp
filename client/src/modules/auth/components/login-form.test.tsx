import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import { LoginForm } from './login-form';

vi.mock('@/assets/icons', () => ({
	Google: () => <svg data-testid="google-icon" />,
	Pity: () => <svg data-testid="pity-icon" />,
}));

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
	const actual = await vi.importActual<typeof import('react-router')>('react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const mocks = vi.hoisted(() => {
	const state = {
		storeStatus: 'idle' as 'idle' | 'loading' | 'authenticated' | 'anonymous',
	};
	const mockLogin = vi.fn();
	const mockStore = (selector: (state: { status: string; login: typeof mockLogin; user: null }) => unknown) =>
		selector({ status: state.storeStatus, login: mockLogin, user: null });
	(mockStore as unknown as { getState: () => { status: string; login: typeof mockLogin; user: null } }).getState = () => ({
		status: state.storeStatus,
		login: mockLogin,
		user: null,
	});
	return { state, mockLogin, mockStore };
});

vi.mock('@/modules/auth/store/auth.store', () => ({
	useAuthStore: mocks.mockStore,
}));

function renderForm() {
	return render(
		<MemoryRouter>
			<LoginForm />
		</MemoryRouter>,
	);
}

describe('login-form', () => {
	beforeEach(() => {
		mocks.state.storeStatus = 'idle';
		vi.clearAllMocks();
	});

	it('submits credentials and navigates on success', async () => {
		mocks.mockLogin.mockResolvedValue(undefined);
		const user = userEvent.setup();

		renderForm();

		const emailInput = screen.getByPlaceholderText('Email');
		const passwordInput = screen.getByPlaceholderText('Password');
		const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

		await user.type(emailInput, 'test@example.com');
		await user.type(passwordInput, 'password123');
		await user.click(submitButton);

		await waitFor(() => {
			expect(mocks.mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
		});
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	it('disables submit button while loading', () => {
		mocks.state.storeStatus = 'loading';
		renderForm();

		const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
		expect(submitButton).toBeDisabled();
	});

	it('shows root error message on login failure', async () => {
		mocks.mockLogin.mockRejectedValue(new Error('Invalid credentials'));
		const user = userEvent.setup();

		renderForm();

		const emailInput = screen.getByPlaceholderText('Email');
		const passwordInput = screen.getByPlaceholderText('Password');
		const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

		await user.type(emailInput, 'test@example.com');
		await user.type(passwordInput, 'wrong');
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText('Credenciales inválidas. Por favor, intentalo de nuevo.'),
			).toBeInTheDocument();
		});
	});
});
