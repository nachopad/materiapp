import { describe, expect, it } from 'vitest';
import { enrollmentSchema, DATE_MODE_VALUES } from './enrollment-form.schema';
import type { EnrollmentFormValues, DateMode } from './enrollment-form.schema';

describe('enrollmentSchema', () => {
    describe('dateMode validation', () => {
        it('validates fullDate mode with valid date', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '',
            });
            expect(result.success).toBe(true);
        });

        it('fails fullDate mode when date is empty', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '',
                monthYear: '',
            });
            expect(result.success).toBe(false);
        });

        it('validates monthYear mode with valid month/year', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '2024-06',
            });
            expect(result.success).toBe(true);
        });

        it('fails monthYear mode when monthYear is empty', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '',
            });
            expect(result.success).toBe(false);
        });

        it('accepts empty inactive field in fullDate mode', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '', // inactive field
            });
            expect(result.success).toBe(true);
        });

        it('accepts empty inactive field in monthYear mode', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '', // inactive field
                monthYear: '2024-06',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('inactive field preservation', () => {
        it('preserves fullDate value when switching to monthYear mode', () => {
            // This tests that inactive field data is NOT erased on mode switch
            // The schema should accept monthYear mode while fullDate has value
            const result = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '2024-03-15', // should be preserved, not rejected
                monthYear: '2024-06',
            });
            expect(result.success).toBe(true);
        });

        it('preserves monthYear value when switching to fullDate mode', () => {
            const result = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '2024-06', // should be preserved, not rejected
            });
            expect(result.success).toBe(true);
        });
    });
});

describe('EnrollmentFormValues type', () => {
    it('accepts valid fullDate shape', () => {
        const data: EnrollmentFormValues = {
            dateMode: 'fullDate',
            fullDate: '2024-03-15',
            monthYear: '',
        };
        expect(data.dateMode).toBe('fullDate');
    });

    it('accepts valid monthYear shape', () => {
        const data: EnrollmentFormValues = {
            dateMode: 'monthYear',
            fullDate: '',
            monthYear: '2024-06',
        };
        expect(data.dateMode).toBe('monthYear');
    });
});

describe('DateMode type and constants', () => {
    it('DateMode is "fullDate" | "monthYear"', () => {
        const mode: DateMode = 'fullDate';
        expect(mode).toBe('fullDate');
    });

    it('DATE_MODE_VALUES contains both modes', () => {
        expect(DATE_MODE_VALUES).toContain('fullDate');
        expect(DATE_MODE_VALUES).toContain('monthYear');
        expect(DATE_MODE_VALUES).toHaveLength(2);
    });
});