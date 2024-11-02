import { Controller, Post, Body } from '@nestjs/common';
import { DriveService } from './drive.service';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post('upload')
  async uploadToDrive(@Body() body: { pdfPath: string; folderId: string }) {
    await this.driveService.uploadToDrive(body.pdfPath, body.folderId);
    return { message: 'PDF uploaded successfully' };
  }
}