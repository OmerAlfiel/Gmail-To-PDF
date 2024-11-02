import { Controller, Post, Body } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('create')
  async createPDF(@Body() emailData: { subject: string; from: string; date: string; body: string }) {
    const pdfPath = await this.pdfService.createPDF(emailData);
    return { message: 'PDF created successfully', pdfPath };
  }
}