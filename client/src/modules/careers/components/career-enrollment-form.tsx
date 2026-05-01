"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { useEnrollmentsStore } from '@/modules/enrollments/store/enrollments.store';
import {
    enrollmentSchema,
    type EnrollmentFormValues,
} from '../schemas/enrollment-form.schema';
import type { EnrollmentDate } from '../types';

interface CareerEnrollmentFormProps {
    careerId: string;
    careerName: string;
    onSuccess?: () => void;
}

/**
 * Enrollment form content for use inside Popover.
 * Supports fullDate (YYYY-MM-DD) OR monthYear (YYYY-MM) inputs.
 * Uses shared schema module for consistent validation across entry points.
 */
export function CareerEnrollmentForm({
    careerId,
    careerName,
    onSuccess,
}: CareerEnrollmentFormProps) {
    const enroll = useEnrollmentsStore((state) => state.enroll);

    const form = useForm<EnrollmentFormValues>({
        resolver: zodResolver(enrollmentSchema),
        mode: 'onChange',
        defaultValues: {
            dateMode: 'fullDate',
            fullDate: '',
            monthYear: '',
        },
    });

    const { dateMode } = form.watch();

    // Focus first field on mount (mount-only, not mode-driven)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (dateMode === 'fullDate') {
                document.getElementById('fullDate')?.focus();
            } else {
                document.getElementById('monthYear')?.focus();
            }
        }, 0);
        return () => clearTimeout(timeout);
    }, [dateMode]);

    const onSubmit = (data: EnrollmentFormValues) => {
        let enrollmentDate: EnrollmentDate;

        if (data.dateMode === 'fullDate' && data.fullDate) {
            enrollmentDate = { mode: 'fullDate', value: data.fullDate };
        } else if (data.dateMode === 'monthYear' && data.monthYear) {
            enrollmentDate = { mode: 'monthYear', value: data.monthYear };
        } else {
            return; // Should not happen due to validation
        }

        enroll(careerId, enrollmentDate);
        onSuccess?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Inscribirse en {careerName}</h3>
                    <p className="text-xs text-muted-foreground">
                        Completá la siguiente información para realizar tu inscripción.
                    </p>
                </div>

                {/* Date mode toggle */}
                <FormField
                    control={form.control}
                    name="dateMode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">¿Cuándo te inscribiste?</FormLabel>
                            <FormControl>
                                <div className="flex gap-2" role="radiogroup" aria-label="Modo de fecha">
                                    <label
                                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border cursor-pointer transition-colors text-xs ${
                                            field.value === 'fullDate'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-accent'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            value="fullDate"
                                            checked={field.value === 'fullDate'}
                                            onChange={() => field.onChange('fullDate')}
                                            className="sr-only"
                                        />
                                        <span className="font-medium">Fecha completa</span>
                                    </label>
                                    <label
                                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border cursor-pointer transition-colors text-xs ${
                                            field.value === 'monthYear'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-accent'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            value="monthYear"
                                            checked={field.value === 'monthYear'}
                                            onChange={() => field.onChange('monthYear')}
                                            className="sr-only"
                                        />
                                        <span className="font-medium">Mes/Año</span>
                                    </label>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Date input - conditional based on mode */}
                <div className="space-y-2">
                    {dateMode === 'fullDate' ? (
                        <FormField
                            control={form.control}
                            name="fullDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="fullDate" className="text-xs font-medium">
                                        Fecha de inscripción
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="fullDate"
                                            type="date"
                                            {...field}
                                            className="mt-1 h-8 text-xs"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            control={form.control}
                            name="monthYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="monthYear" className="text-xs font-medium">
                                        Mes y año de inscripción
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="monthYear"
                                            type="month"
                                            {...field}
                                            className="mt-1 h-8 text-xs"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="flex gap-2 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={() => onSuccess?.()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        disabled={!form.formState.isValid}
                    >
                        Confirmar
                    </Button>
                </div>
            </form>
        </Form>
    );
}