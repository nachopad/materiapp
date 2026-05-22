export const AUTH_ROLE = {
    ADMIN: 'admin',
    USER: 'user',
    STUDENT: 'student',
} as const;

export type AuthRole = (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE];

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    roles: AuthRole[];
    isGoogleUser: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';
