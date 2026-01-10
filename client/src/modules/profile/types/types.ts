/**
 * Profile module types
 */

export interface AccountProvider {
    provider: 'google' | 'email';
    isLinked: boolean;
    email?: string;
}

export interface University {
    id: string;
    name: string;
    logoUrl?: string;
    enrollmentDate: string;
}

export interface CareerProgress {
    id: string;
    name: string;
    percentage: number;
    approved: number;
    regular: number;
    pending: number;
}

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    joinedAt: string;
    accountProviders: AccountProvider[];
    universities: University[];
    careerProgress: CareerProgress[];
}
