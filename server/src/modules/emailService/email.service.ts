import nunjucks from 'nunjucks';
import { Resend } from 'resend';
import config from '../../config/config.js';

export default class EmailService {
    private resend = new Resend(config.RESEND_API_KEY);

    async sendPasswordResetEmail(email: string, firstname: string, resetUrl: string, ) {

        const html = nunjucks.render('password-reset.html', {firstname,resetUrl});

        return this.resend.emails.send({
            from: 'laundroclean@yahoo.com',
            to: email,
            subject: `Reset Your ${config.APP_NAME} Password`,
            html: html
        });
    };
}