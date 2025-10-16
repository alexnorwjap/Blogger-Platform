import nodemailer from 'nodemailer';
import { InputRegistrationDto } from '../repository/dto/authDto';
import { SETTINGS } from '../../../shared/settings/settings';

class EmailAdapter {
  async sendEmail(sendDto: InputRegistrationDto, confirmationCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL_USER,
        pass: SETTINGS.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `Mailito <${SETTINGS.EMAIL_USER}>`,
      to: sendDto.email,
      subject: 'Registration confirmation',
      html: ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>

`,
    });
  }
}

export const emailAdapter = new EmailAdapter();
