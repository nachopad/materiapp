import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { mailConfig } from '@/core/config'; 
import { mailService } from './services/mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: mailConfig, //Configuración del Emisor, internamente se crear un string con cada configuración
            defaults: {
                from: '"Activación de Cuenta v1.0.0" <materiaapp@gmail.com>', //Le aparecera como remitente en la bandeja de correos
            },
            template: { //Configuración del motor de renderización ya se para Pug u otros
                dir: process.cwd() + '/src/module/mail/templates',//Indicamos al motor donde estan las plantillas, use __dirname pero me busca en node_module/dist WTF asi que cambie al actual
                adapter: new PugAdapter(), //Le indicamos el motor de renderización a utilizar
                options:{
                    strict: true //Con esta opción evitamos enviar correos que le falten variables del contexto
                }
            }
        })
    ],
    controllers: [],
    providers: [mailService],
    exports: [mailService]
})
export class MailModule { }
