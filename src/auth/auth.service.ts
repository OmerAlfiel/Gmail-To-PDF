import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  private oAuth2Client;

  constructor() {
    this.initializeOAuthClient();
  }

  private initializeOAuthClient() {
    const credentialsPath = path.join(__dirname, '../../credentials.json');
    const tokenPath = path.join(__dirname, '../../token.json');

    fs.readFile(credentialsPath, (err, content) => {
      if (err) return console.error('Error loading client secret file:', err);
      const credentials = JSON.parse(content.toString());
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      fs.readFile(tokenPath, (err, token) => {
        if (err) {
          this.getAccessToken();
        } else {
          this.oAuth2Client.setCredentials(JSON.parse(token.toString()));
        }
      });
    });
  }

  private getAccessToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/drive.file'],
    });
    console.log('Authorize this app by visiting this url:', authUrl);
  }

  public generateAuthUrl(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/drive.file'],
    });
  }

  public async getToken(code: string): Promise<void> {
    const tokenPath = path.join(__dirname, '../../token.json');
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    console.log('Token stored to', tokenPath);
  }

  public async getGmailClient() {
    return google.gmail({ version: 'v1', auth: this.oAuth2Client });
  }

  public async getDriveClient() {
    return google.drive({ version: 'v3', auth: this.oAuth2Client });
  }
}