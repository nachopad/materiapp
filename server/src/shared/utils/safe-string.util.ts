export function xssSafeString(value: string): boolean {
    // Permite letras, números, espacios y acentos básicos (ajústalo según tus necesidades)
    return /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ-]+$/.test(value);
}

export const xssSafeStringMessage = (props: any) =>
    `${props.value} contains invalid characters.`;