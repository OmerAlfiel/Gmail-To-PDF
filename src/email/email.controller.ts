import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('fetch')
  async fetchEmails(@Query('query') query: string) {
    await this.emailService.listMessages(query);
    return 'Emails fetched and processed successfully';
  }
}