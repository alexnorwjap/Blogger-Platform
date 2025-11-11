import nodemailer from 'nodemailer';
import { SETTINGS } from '../../../shared/settings/settings';

class EmailAdapter {
  async sendEmail(email: string, confirmationCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL_USER,
        pass: SETTINGS.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `Mailito <${SETTINGS.EMAIL_USER}>`,
      to: email,
      subject: 'Registration confirmation',
      html: ` <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
      </p>
`,
    });
  }
  async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL_USER,
        pass: SETTINGS.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `Mailito <${SETTINGS.EMAIL_USER}>`,
      to: email,
      subject: 'Password recovery',
      html: `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
         <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
     </p>
`,
    });
  }
}

export const emailAdapter = new EmailAdapter();
