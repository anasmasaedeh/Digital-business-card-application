import { Injectable, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    @Inject('MAILER_TRANSPORTER')
    private readonly transporter: nodemailer.Transporter,
  ) {}

   async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Your App <noreply@yourapp.com>',
      to: email,
      subject: 'OTP Verification Code',
      text: `Your OTP verification code is: ${code}`,
    });
  }

    async sendResetPasswordLink(email: string, resetToken: string): Promise<void> {
    const resetUrl = `https://yourapp.com/reset-password?token=${resetToken}`;
    await this.transporter.sendMail({
      from: 'Your App <noreply@yourapp.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
    });
  }

  async sendFriendRequestNotificationEmail(toEmail: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'Your App <noreply@yourapp.com>',
      to: toEmail,
      subject: 'You have a new friend request!',
      text: 'You have received a new friend request on Your App.',
    });
  }
  async sendMail(mailOptions: nodemailer.SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(`Error occurred while sending email. Error: ${err}`);
      throw err;
    }
  }

}