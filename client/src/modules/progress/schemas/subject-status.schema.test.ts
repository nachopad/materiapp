import { describe, expect, it } from 'vitest';
import { subjectStatusSchema } from './subject-status.schema';
import { SUBJECT_STATUS } from '../types';
import type { SubjectStatusFormValues } from './subject-status.schema';

describe('subjectStatusSchema', () => {
    describe('approved status', () => {
        it('validates approved with a valid grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 8,
            });
            expect(result.success).toBe(true);
        });

        it('rejects approved without a grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
            });
            expect(result.success).toBe(false);
        });

        it('rejects approved with grade below 1', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 0,
            });
            expect(result.success).toBe(false);
        });

        it('rejects approved with grade above 10', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 11,
            });
            expect(result.success).toBe(false);
        });

        it('coerces string grade to number', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: '7',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.grade).toBe(7);
            }
        });

        it('accepts grade at lower bound 1', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 1,
            });
            expect(result.success).toBe(true);
        });

        it('accepts grade at upper bound 10', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 10,
            });
            expect(result.success).toBe(true);
        });

        it('rejects approved with non-numeric string grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.APPROVED,
                grade: 'abc',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('regular status', () => {
        it('validates regular without grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.REGULAR,
            });
            expect(result.success).toBe(true);
        });

        it('rejects regular with a grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.REGULAR,
                grade: 5,
            });
            expect(result.success).toBe(false);
        });
    });

    describe('pending status', () => {
        it('validates pending without grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.PENDING,
            });
            expect(result.success).toBe(true);
        });

        it('rejects pending with a grade', () => {
            const result = subjectStatusSchema.safeParse({
                status: SUBJECT_STATUS.PENDING,
                grade: 5,
            });
            expect(result.success).toBe(false);
        });
    });

    describe('invalid status', () => {
        it('rejects an unknown status value', () => {
            const result = subjectStatusSchema.safeParse({
                status: 'unknown',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('SubjectStatusFormValues type', () => {
        it('accepts approved shape with grade', () => {
            const data: SubjectStatusFormValues = {
                status: SUBJECT_STATUS.APPROVED,
                grade: 8,
            };
            expect(data.status).toBe(SUBJECT_STATUS.APPROVED);
            expect(data.grade).toBe(8);
        });

        it('accepts regular shape without grade', () => {
            const data: SubjectStatusFormValues = {
                status: SUBJECT_STATUS.REGULAR,
            };
            expect(data.status).toBe(SUBJECT_STATUS.REGULAR);
        });
    });
});
