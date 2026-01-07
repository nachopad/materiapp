import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { MailPayload, VerificationEmailContext } from "../interfaces/mail.interface";

@Injectable()
export class mailService {

    constructor(private readonly mailerService: MailerService) {

    }

    async sendVerificationEmail(to: string, context: VerificationEmailContext): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to,
                subject: 'Verifica tu cuenta',//El asunto CREO XD
                template: 'verify-email', //Nombre del archivo pug sin extencion, ya esta configurado donde buscara en mail.modules
                context,
            });
        } catch (error) {
            return error;
        }
    }

    async sendWelcome(to: string, name: string): Promise<void>{
        try {
            await this.mailerService.sendMail({
                to,
                subject: 'Bienvenido a MateriaApp',
                template: 'welcome-to-our-app',
                context: {
                    username: name
                }
            });
        } catch (error) {
            return error;
        }
    }
    //Si quieren  enviar algun email por X razon
    async sendGenericEmail(payload: MailPayload): Promise<void> {
        await this.mailerService.sendMail({
            to: payload.to,
            subject: payload.subject,
            template: payload.template,
            context: payload.context,
            html: payload.html,
            text: payload.text
        })
    }
}