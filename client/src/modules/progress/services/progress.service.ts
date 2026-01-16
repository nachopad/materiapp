import { api } from '@/core/api';
import type { Career } from '../types';

/**
 * Progress API service
 */
export const progressService = {
    /**
     * Fetch all careers with progress data
     */
    async getCareers(): Promise<Career[]> {
        const response = await api.get<Career[]>('/progress/careers');
        return response.data;
    },

    /**
     * Fetch a specific career with its subjects
     */
    async getCareerById(careerId: string): Promise<Career> {
        const response = await api.get<Career>(`/progress/careers/${careerId}`);
        return response.data;
    },
};
