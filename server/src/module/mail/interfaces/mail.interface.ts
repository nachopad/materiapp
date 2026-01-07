//TO SEND A GENERAL EMAIL
export interface MailPayload {
    to: string;
    subject: string;
    template?: string;
    context?: any;
    html?: string;
    text?: string;
}

export interface VerificationEmailContext {
    username: string,
    verificationLink: string, // Account activation code
}