import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import Mail from 'nodemailer/lib/mailer';
import { logger } from './logger';
import { sendMail } from '../interfaces/sendmail.interface';
import { getConfig } from '../config';
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: getConfig().SMTP_SERVICE as string,
      auth: {
        user: getConfig().SMTP_SERVICE_EMAIL as string,
        pass: getConfig().SMTP_SERVICE_PASSWORD as string,
      },
    });
  }

  public async sendMail({ templateName, recipientEmail, subject, templateData }: sendMail) {
    try {
      const templatePath = path.resolve(__dirname, '..', 'templates', `${templateName}`, `${templateName}.ejs`);

      const mailBody: string = await ejs.renderFile(templatePath, templateData);

      const mailOptions: Mail.Options = {
        from: `${getConfig().SMTP_SERVICE_EMAIL}` as string,
        to: recipientEmail,
        subject: subject,
        html: mailBody,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully');
    } catch (err) {
      logger.error('Error in  sending mail', err);
    }
  }
}
