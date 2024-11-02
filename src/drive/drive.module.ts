import { Module } from '@nestjs/common';
import { DriveService } from './drive.service';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule], 
  providers: [DriveService],
  exports: [DriveService],
})
export class DriveModule {}