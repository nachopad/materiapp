import { api } from '@/core/api';
import type { UserProfile } from '../types';

/**
 * Profile API service
 */
export const profileService = {
    /**
     * Fetch current user profile
     */
    async getProfile(): Promise<UserProfile> {
        const response = await api.get<UserProfile>('/profile');
        return response.data;
    },

    /**
     * Update user profile data
     */
    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        const response = await api.patch<UserProfile>('/profile', data);
        return response.data;
    },

    /**
     * Change user password
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        await api.post('/profile/change-password', { currentPassword, newPassword });
    },

    /**
     * Link Google account
     */
    async linkGoogle(): Promise<void> {
        await api.post('/profile/link-google');
    },

    /**
     * Unlink Google account
     */
    async unlinkGoogle(): Promise<void> {
        await api.delete('/profile/link-google');
    },
};
