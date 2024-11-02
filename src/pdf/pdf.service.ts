import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  public async createPDF(emailData: { subject: string; from: string; date: string; body: string }): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { height } = page.getSize();
    const fontSize = 12;

    page.drawText(`Subject: ${emailData.subject}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`From: ${emailData.from}`, {
      x: 50,
      y: height - 6 * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${emailData.date}`, {
      x: 50,
      y: height - 8 * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Body:`, {
      x: 50,
      y: height - 10 * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    const bodyLines = emailData.body.split('\n');
    let yPosition = height - 12 * fontSize;
    bodyLines.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize + 2;
    });

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(__dirname, '../../pdf-reports', `email-${Date.now()}.pdf`);
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
    fs.writeFileSync(pdfPath, pdfBytes);
    console.log('PDF created and saved in pdf-reports folder');
    return pdfPath;
  }
}