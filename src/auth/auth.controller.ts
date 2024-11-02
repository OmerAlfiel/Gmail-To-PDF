import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const url = this.authService.generateAuthUrl();
    res.redirect(url);
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      await this.authService.getToken(code);
      res.send('Authentication successful! You can close this window.');
    } catch (error) {
      res.status(400).send('Error retrieving access token');
    }
  }
}