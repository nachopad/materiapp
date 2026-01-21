import { api } from '@/core/api';
import type { Enrollment } from '../types';

/**
 * Enrollments API service
 */
export const enrollmentsService = {
    /**
     * Fetch all enrollments for the logged user
     */
    async getEnrollments(): Promise<Enrollment[]> {
        const response = await api.get<Enrollment[]>('/enrollment');
        return response.data;
    },

    /**
     * Create a new enrollment
     */
    async createEnrollment(data: {
        career: string;
        college: string;
        subjects: Array<{
            subject: string;
            qualification?: number;
            date?: Date;
            state: string;
        }>;
    }): Promise<Enrollment> {
        const response = await api.post<Enrollment>('/enrollment', data);
        return response.data;
    },
};
