import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer'
@Module({
  imports: [
  ],
  providers: [ {
    provide: 'MAILER_TRANSPORTER',
    useFactory: async () => {
      return nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        secure: false,
        port: 587,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    },
  },
  MailService,
    MailService],
  exports: [MailService],
})
export class MailModule {}