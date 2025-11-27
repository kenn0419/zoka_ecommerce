import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    subject: string,
    verifyToken: string,
  ) {
    const template = await this.loadAndCompile('email_verification.html');
    const html = template({ verifyToken });
    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS,
      to,
      subject,
      html,
    });
    this.logger.log(`Sent email ${info.messageId} => ${to}`);
    return info;
  }

  private async loadTemplate(name: string): Promise<string> {
    const p = join(
      process.cwd(),
      'src',
      'infrastructure',
      'mail',
      'templates',
      name,
    );
    const content = await readFile(p, 'utf-8');
    return content;
  }

  private async loadAndCompile(name: string) {
    const tpl = await this.loadTemplate(name);
    return Handlebars.compile(tpl);
  }
}
