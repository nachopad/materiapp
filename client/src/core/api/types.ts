import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiRequestConfig extends InternalAxiosRequestConfig {
    _authRetry?: boolean;
    _skipAuth?: boolean;
}

export class ApiError extends Error {
    readonly statusCode: number;
    readonly originalError?: AxiosError;

    constructor(message: string, statusCode: number, originalError?: AxiosError) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}
