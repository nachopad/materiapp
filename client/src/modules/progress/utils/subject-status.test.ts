import { describe, expect, it } from 'vitest';
import {
    STATUS_LABELS,
    GRADE_BOUNDS,
    normalizeSubjectStatusUpdate,
    recalculateCareerProgress,
} from './subject-status';
import { SUBJECT_STATUS } from '../types';
import type { Subject } from '../types';

describe('STATUS_LABELS', () => {
    it('maps approved to Aprobada', () => {
        expect(STATUS_LABELS[SUBJECT_STATUS.APPROVED]).toBe('Aprobada');
    });

    it('maps regular to Cursando', () => {
        expect(STATUS_LABELS[SUBJECT_STATUS.REGULAR]).toBe('Cursando');
    });

    it('maps pending to Pendiente', () => {
        expect(STATUS_LABELS[SUBJECT_STATUS.PENDING]).toBe('Pendiente');
    });
});

describe('GRADE_BOUNDS', () => {
    it('has MIN of 1', () => {
        expect(GRADE_BOUNDS.MIN).toBe(1);
    });

    it('has MAX of 10', () => {
        expect(GRADE_BOUNDS.MAX).toBe(10);
    });
});

describe('normalizeSubjectStatusUpdate', () => {
    it('returns approved with grade when grade is valid', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
            grade: 8,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: 8 });
    });

    it('clears grade for regular status', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.REGULAR,
            grade: 5,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.REGULAR, grade: undefined });
    });

    it('clears grade for pending status', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.PENDING,
            grade: 5,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.PENDING, grade: undefined });
    });

    it('clears grade for approved when grade is below minimum', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
            grade: 0,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: undefined });
    });

    it('clears grade for approved when grade is above maximum', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
            grade: 11,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: undefined });
    });

    it('clears grade for approved when grade is undefined', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: undefined });
    });

    it('preserves grade at lower bound 1 for approved', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
            grade: 1,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: 1 });
    });

    it('preserves grade at upper bound 10 for approved', () => {
        const result = normalizeSubjectStatusUpdate({
            status: SUBJECT_STATUS.APPROVED,
            grade: 10,
        });
        expect(result).toEqual({ status: SUBJECT_STATUS.APPROVED, grade: 10 });
    });
});

describe('recalculateCareerProgress', () => {
    it('returns zeros for empty subjects array', () => {
        const result = recalculateCareerProgress([]);
        expect(result).toEqual({ approved: 0, regular: 0, pending: 0, progress: 0, average: 0 });
    });

    it('calculates stats for all approved subjects', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 8 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 10 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result).toEqual({ approved: 2, regular: 0, pending: 0, progress: 100, average: 9 });
    });

    it('calculates stats for all pending subjects', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.PENDING, year: 1 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.PENDING, year: 1 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result).toEqual({ approved: 0, regular: 0, pending: 2, progress: 0, average: 0 });
    });

    it('calculates stats for regular subjects', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.REGULAR, year: 1 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.REGULAR, year: 1 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result).toEqual({ approved: 0, regular: 2, pending: 0, progress: 0, average: 0 });
    });

    it('calculates average only from approved subjects with grades', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 8 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.APPROVED, year: 1 },
            { id: '3', name: 'C', status: SUBJECT_STATUS.PENDING, year: 1 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result.approved).toBe(2);
        expect(result.regular).toBe(0);
        expect(result.pending).toBe(1);
        expect(result.progress).toBe(67);
        expect(result.average).toBe(8);
    });

    it('calculates mixed stats correctly', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 7 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 9 },
            { id: '3', name: 'C', status: SUBJECT_STATUS.PENDING, year: 1 },
            { id: '4', name: 'D', status: SUBJECT_STATUS.REGULAR, year: 1 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result.approved).toBe(2);
        expect(result.regular).toBe(1);
        expect(result.pending).toBe(1);
        expect(result.progress).toBe(50);
        expect(result.average).toBe(8);
    });

    it('calculates decimal average correctly', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 7 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 8 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result.average).toBe(7.5);
    });

    it('handles approved subjects without grades in average', () => {
        const subjects: Subject[] = [
            { id: '1', name: 'A', status: SUBJECT_STATUS.APPROVED, year: 1 },
            { id: '2', name: 'B', status: SUBJECT_STATUS.APPROVED, year: 1, grade: 10 },
        ];
        const result = recalculateCareerProgress(subjects);
        expect(result.approved).toBe(2);
        expect(result.average).toBe(10);
    });
});
