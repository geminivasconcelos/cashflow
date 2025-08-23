import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: String(process.env.SMTP_PASS),
      },
    });
  }

  async sendAccountCreatedEmail(to: string, username: string) {
    const info = await this.transporter.sendMail({
      from: `"Cashflow App" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Conta criada com sucesso!',
      html: `<p>Olá ${username},</p>
             <p>Sua conta no Cashflow foi criada com sucesso!</p>
             <p>Agora você pode acessar o sistema e começar a gerenciar suas finanças.</p>`,
    });

    this.logger.log(`Email enviado: ${info.messageId}`);
  }

  async sendResetPasswordEmail(to: string, code: string) {
    await this.transporter.sendMail({
      from: `"Cashflow App" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Recuperação de senha',
      html: `<p>Seu código de recuperação é: <b>${code}</b></p>
           <p>Ele expira em 15 minutos.</p>`,
    });
  }
  
}
