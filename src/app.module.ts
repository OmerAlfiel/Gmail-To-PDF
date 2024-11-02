import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PdfModule } from './pdf/pdf.module';
import { DriveModule } from './drive/drive.module';
import { AuthService } from './auth/auth.service';
import { EmailService } from './email/email.service';
import { PdfService } from './pdf/pdf.service';
import { DriveService } from './drive/drive.service';
import { AuthController } from './auth/auth.controller';
import { EmailController } from './email/email.controller';
import { PdfController } from './pdf/pdf.controller';
import { DriveController } from './drive/drive.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), AuthModule, EmailModule, PdfModule, DriveModule],
  controllers: [AppController, AuthController, EmailController, PdfController, DriveController],
  providers: [AppService, AuthService, EmailService, PdfService, DriveService],
})
export class AppModule {}