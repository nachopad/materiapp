import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { api } from './index';

const mockClear = vi.fn();

vi.mock('@/modules/auth/store/auth.store', () => ({
	useAuthStore: {
		getState: () => ({ clear: mockClear }),
	},
}));

describe('api interceptors', () => {
	let mockAdapter: Mock;

	beforeEach(() => {
		vi.clearAllMocks();
		mockAdapter = vi.fn();
		api.defaults.adapter = mockAdapter;
	});

	function given401WithRetrySuccess() {
		mockAdapter.mockImplementation(async (config) => {
			if (config.url?.includes('/auth/refresh')) {
				return { data: undefined, status: 200, statusText: 'OK', headers: {}, config };
			}
			if (config._authRetry) {
				return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
			}
			const error = new AxiosError('Unauthorized', undefined, config, undefined, {
				data: {},
				status: 401,
				statusText: 'Unauthorized',
				headers: {},
				config,
			});
			return Promise.reject(error);
		});
	}

	function given401WithRetryFailure() {
		mockAdapter.mockImplementation(async (config) => {
			if (config.url?.includes('/auth/refresh')) {
				return { data: undefined, status: 200, statusText: 'OK', headers: {}, config };
			}
			const error = new AxiosError('Unauthorized', undefined, config, undefined, {
				data: {},
				status: 401,
				statusText: 'Unauthorized',
				headers: {},
				config,
			});
			return Promise.reject(error);
		});
	}

	function givenRefreshFailure() {
		mockAdapter.mockImplementation(async (config) => {
			if (config.url?.includes('/auth/refresh')) {
				const error = new AxiosError('Refresh failed', undefined, config, undefined, {
					data: {},
					status: 401,
					statusText: 'Unauthorized',
					headers: {},
					config,
				});
				return Promise.reject(error);
			}
			const error = new AxiosError('Unauthorized', undefined, config, undefined, {
				data: {},
				status: 401,
				statusText: 'Unauthorized',
				headers: {},
				config,
			});
			return Promise.reject(error);
		});
	}

	it('refreshes once on 401 and retries the original request', async () => {
		given401WithRetrySuccess();

		const response = await api.get('/protected');

		expect(response.status).toBe(200);
		expect(response.data).toEqual({ ok: true });
	});

	it('concurrent 401s share a single refresh cycle', async () => {
		given401WithRetrySuccess();

		const [resA, resB] = await Promise.all([api.get('/request-a'), api.get('/request-b')]);

		expect(resA.status).toBe(200);
		expect(resB.status).toBe(200);

		const refreshCalls = mockAdapter.mock.calls.filter(([cfg]) =>
			(cfg as { url?: string }).url?.includes('/auth/refresh'),
		);
		expect(refreshCalls).toHaveLength(1);
	});

	it('does not trigger refresh for skipped auth endpoints', async () => {
		given401WithRetrySuccess();

		await expect(api.get('/auth/login')).rejects.toThrow('Unauthorized');
		expect(mockAdapter).toHaveBeenCalledTimes(1);
	});

	it('retries only once and rejects if the retry also 401s', async () => {
		given401WithRetryFailure();

		await expect(api.get('/protected')).rejects.toThrow('Unauthorized');
	});

	it('clears store and rejects when refresh fails', async () => {
		givenRefreshFailure();

		await expect(api.get('/protected')).rejects.toThrow('Session expired');
		expect(mockClear).toHaveBeenCalledTimes(1);
	});
});
