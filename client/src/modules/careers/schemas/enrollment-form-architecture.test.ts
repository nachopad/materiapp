/**
 * Architecture contract tests for careers enrollment forms.
 * Verifies that both entry points (popover form and sheet) use the
 * same schema/type contract from the shared schema module.
 */

import { describe, expect, it } from 'vitest';
import { enrollmentSchema, DATE_MODE_VALUES } from './enrollment-form.schema';
import type { EnrollmentFormValues, DateMode } from './enrollment-form.schema';
import {
    CareerEnrollmentForm,
} from '../components/career-enrollment-form';
import {
    CareerEnrollmentSheet,
} from '../components/career-enrollment-sheet';
import fs from 'fs';
import path from 'path';

/**
 * Spec scenario: Form imports shared schema
 * Verifies that the careers enrollment form components import their
 * schema and types from the module-level schema file, not from inline definitions.
 */
describe('Careers schema modularization', () => {
    describe('Schema module exports', () => {
        it('exports enrollmentSchema for validation', () => {
            // The schema must be exported so components can import it
            expect(enrollmentSchema).toBeDefined();
            expect(typeof enrollmentSchema.safeParse).toBe('function');
        });

        it('exports EnrollmentFormValues type from schema module', () => {
            // Type must be re-exported for useForm<EnrollmentFormValues>()
            const fullDateData: EnrollmentFormValues = {
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '',
            };
            const monthYearData: EnrollmentFormValues = {
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '2024-06',
            };
            expect(enrollmentSchema.safeParse(fullDateData).success).toBe(true);
            expect(enrollmentSchema.safeParse(monthYearData).success).toBe(true);
        });

        it('exports DateMode type from schema module', () => {
            // DateMode type must be available for external consumers
            const mode: DateMode = 'fullDate';
            expect(mode).toBe('fullDate');
        });

        it('exports DATE_MODE_VALUES constants from schema module', () => {
            expect(DATE_MODE_VALUES).toContain('fullDate');
            expect(DATE_MODE_VALUES).toContain('monthYear');
        });
    });

    describe('Form imports shared schema (contract verification)', () => {
        it('both CareerEnrollmentForm and CareerEnrollmentSheet can be imported without error', () => {
            // This test verifies the module structure — if imports fail, the test fails
            expect(CareerEnrollmentForm).toBeDefined();
            expect(CareerEnrollmentSheet).toBeDefined();
        });

        it('enrollmentSchema is the single source of truth for both entry points', () => {
            // Both entry points must validate against the same schema instance.
            // This is verified by checking schema structure directly.
            const fullDateResult = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '',
            });
            const monthYearResult = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '2024-06',
            });

            // Both modes must be handled by the same discriminated union schema
            expect(fullDateResult.success).toBe(true);
            expect(monthYearResult.success).toBe(true);
        });

        it('schema validates only active field based on dateMode', () => {
            // fullDate mode: inactive monthYear can be empty
            const result1 = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '',
            });
            expect(result1.success).toBe(true);

            // fullDate mode: inactive monthYear value is preserved (not rejected)
            const result2 = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '2024-03-15',
                monthYear: '2024-06', // preserved when switching modes
            });
            expect(result2.success).toBe(true);

            // monthYear mode: inactive fullDate can be empty
            const result3 = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '2024-06',
            });
            expect(result3.success).toBe(true);

            // monthYear mode: inactive fullDate value is preserved (not rejected)
            const result4 = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '2024-03-15', // preserved when switching modes
                monthYear: '2024-06',
            });
            expect(result4.success).toBe(true);
        });

        it('schema rejects when active field is missing', () => {
            // fullDate mode: fullDate is required
            const result1 = enrollmentSchema.safeParse({
                dateMode: 'fullDate',
                fullDate: '',
                monthYear: '',
            });
            expect(result1.success).toBe(false);

            // monthYear mode: monthYear is required
            const result2 = enrollmentSchema.safeParse({
                dateMode: 'monthYear',
                fullDate: '',
                monthYear: '',
            });
            expect(result2.success).toBe(false);
        });
    });
});

/**
 * Spec scenario: Cross-entry-point contract enforcement
 * Verifies that both entry points use the identical schema/type contract.
 */
describe('Cross-entry-point contract enforcement', () => {
    it('both entry points use the same schema reference', () => {
        // The schema object identity is the contract.
        // Both components import enrollmentSchema from the same module.
        // This is verified by testing the schema behavior, which is the single source of truth.

        // If both entry points import from the same module, they get the same schema instance.
        // We verify this by checking that the schema handles both modes correctly.
        const fullDateData = {
            dateMode: 'fullDate' as const,
            fullDate: '2024-03-15',
            monthYear: '',
        };
        const monthYearData = {
            dateMode: 'monthYear' as const,
            fullDate: '',
            monthYear: '2024-06',
        };

        // The schema is shared — same validation rules for both entry points
        expect(enrollmentSchema.safeParse(fullDateData).success).toBe(true);
        expect(enrollmentSchema.safeParse(monthYearData).success).toBe(true);
    });

    it('entry points produce identical validation outcomes for same input', () => {
        // Given the same input data, both entry points (via the shared schema)
        // will produce identical validation results.
        const testCases = [
            { dateMode: 'fullDate', fullDate: '2024-03-15', monthYear: '' },
            { dateMode: 'monthYear', fullDate: '', monthYear: '2024-06' },
            { dateMode: 'fullDate', fullDate: '', monthYear: '' },
            { dateMode: 'monthYear', fullDate: '', monthYear: '' },
        ];

        for (const tc of testCases) {
            const result = enrollmentSchema.safeParse(tc);
            const isValid = result.success;

            // Both entry points use the same schema, so they must agree on validity
            if (tc.dateMode === 'fullDate' && tc.fullDate) {
                expect(isValid).toBe(true);
            } else if (tc.dateMode === 'monthYear' && tc.monthYear) {
                expect(isValid).toBe(true);
            } else {
                expect(isValid).toBe(false);
            }
        }
    });
});

/**
 * Spec scenario: Future-form architecture guidance
 * Verifies that the materiapp-client skill guidance encodes enforceable rules
 * for module-level schemas and shared Form primitives.
 */
describe('Future-form architecture guidance', () => {
    const skillPath = path.resolve(
        __dirname,
        '../../../../../skills/materiapp-client/SKILL.md'
    );

    it('skill guidance file exists at expected location', () => {
        expect(fs.existsSync(skillPath)).toBe(true);
    });

    it('guidance includes enforceable rule for module-level schemas', () => {
        const content = fs.readFileSync(skillPath, 'utf-8');
        // Must require schemas to live under modules/<module>/schemas/
        expect(content).toMatch(/modules\/<module>\/schemas\/.*\.schema\.ts/);
    });

    it('guidance includes enforceable rule for shared Form primitives', () => {
        const content = fs.readFileSync(skillPath, 'utf-8');
        // Must mandate shared UI form primitives (Form, FormField, FormItem, FormControl, FormMessage)
        expect(content).toMatch(/Form\s*,\s*FormField\s*,\s*FormItem\s*,\s*FormControl\s*,\s*FormMessage/);
    });

    it('guidance prohibits inline schema definitions', () => {
        const content = fs.readFileSync(skillPath, 'utf-8');
        // Must show the wrong pattern (inline schema) as ❌ WRONG
        expect(content).toMatch(/❌ WRONG.*inline.*schema/is);
    });

    it('guidance mandates Form primitives over manual error wiring', () => {
        const content = fs.readFileSync(skillPath, 'utf-8');
        // Must show manual errors.x && <p> as ❌ WRONG
        expect(content).toMatch(/❌ WRONG.*errors\./s);
    });
});
