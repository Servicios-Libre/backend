/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import emailHelper from 'src/helpers/emailHelper';

@Injectable()
export class EmailService {
  async sendEmail(to, subject, text) {
    await emailHelper(to, subject, text);
  }
}
