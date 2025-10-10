import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsUniqueSubjectArray(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUniqueSubjectArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any[], args: ValidationArguments) {
                    if (!Array.isArray(value)) return false;
                    const ids = value.map(item => item[property]);
                    return new Set(ids).size === ids.length;
                },
                defaultMessage(args: ValidationArguments) {
                    return `Subjects array contains duplicate subject IDs`;
                },
            },
        });
    };
}