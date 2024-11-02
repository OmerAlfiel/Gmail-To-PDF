import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from '../auth/auth.service';
import { PdfService } from '../pdf/pdf.service';
import { DriveService } from '../drive/drive.service';
import { google } from 'googleapis';

@Injectable()
export class EmailService {
  constructor(
    private readonly authService: AuthService,
    private readonly pdfService: PdfService,
    private readonly driveService: DriveService,
  ) {}

  @Cron('0 * * * *') // Runs every hour
  public async handleCron() {
    console.log('Running cron job to fetch and process emails');
    await this.listMessages('subject:Your Subject Here'); // Define your search criteria here
  }

  public async listMessages(query: string) {
    const gmail = await this.authService.getGmailClient();
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
    });

    if (res.data.messages && res.data.messages.length) {
      console.log('Messages:');
      return res.data.messages;
    } else {
      console.log('No messages found.');
      return [];
    }
  }

  public async getMessage(messageId: string) {
    const gmail = await this.authService.getGmailClient();
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });

    return res.data;
  }

  public parseEmail(message: any) {
    const headers = message.payload.headers;
    const subject = headers.find(header => header.name === 'Subject').value;
    const from = headers.find(header => header.name === 'From').value;
    const date = headers.find(header => header.name === 'Date').value;
    const body = this.getBody(message.payload);

    return {
      subject,
      from,
      date,
      body,
    };
  }

  private getBody(payload: any) {
    let body = '';
    if (payload.parts) {
      payload.parts.forEach(part => {
        if (part.mimeType === 'text/plain') {
          body += Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      });
    } else {
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }
    return body;
  }
}