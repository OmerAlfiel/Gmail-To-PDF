import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AuthModule } from '../auth/auth.module'; 
import { PdfModule } from '../pdf/pdf.module';
import { DriveModule } from '../drive/drive.module';

@Module({
  imports: [AuthModule, PdfModule, DriveModule], 
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}