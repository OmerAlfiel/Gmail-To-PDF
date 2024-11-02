import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { PdfService } from './pdf/pdf.service';
import { DriveService } from './drive/drive.service';

@Controller()
export class AppController {
  constructor(
    private readonly emailService: EmailService,
    private readonly pdfService: PdfService,
    private readonly driveService: DriveService,
  ) {}

  @Get('process-emails')
  async processEmails(@Query('query') query: string, @Query('folderId') folderId: string) {
    // Fetch emails based on the query
    const messages = await this.emailService.listMessages(query);

    for (const message of messages) {
      // Parse email content
      const emailData = this.emailService.parseEmail(message);

      // Create PDF from email content
      const pdfPath = await this.pdfService.createPDF(emailData);

      // Upload PDF to Google Drive
      await this.driveService.uploadToDrive(pdfPath, folderId);
    }

    return 'Emails processed and PDFs uploaded successfully';
  }
}