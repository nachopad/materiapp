import { HOST_MAIL, PASSWORD_APP, PORT_MAIL, SECURE, USER_REMITENTE } from "../environment";

export const mailConfig = {
    host: HOST_MAIL,
    port: PORT_MAIL, //Mas usado, la diferrencia con el otro puerto el 465 es como inicia, en este caso inicia sin encriptar y luego se pasa a TLS, 465 se enccripta desde el principio
    secure: SECURE,
    auth: {
        user: USER_REMITENTE, // Email de materiaap
        pass: PASSWORD_APP, // Esto se generar desde la cuenta de google
    },
};