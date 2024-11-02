import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DriveService {
  constructor(private readonly authService: AuthService) {}

  public async uploadToDrive(pdfPath: string, folderId: string): Promise<void> {
    const drive = await this.authService.getDriveClient();
    const fileMetadata = {
      name: path.basename(pdfPath),
      parents: [folderId],
    };
    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(pdfPath),
    };

    try {
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });
      const file = response.data;
      console.log('File Id:', file.id);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}