import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsUniqueArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUniqueArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any[], args: ValidationArguments) {
                    if (!Array.isArray(value)) return false;
                    return new Set(value).size === value.length;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} array contains duplicate values`;
                },
            },
        });
    };
}