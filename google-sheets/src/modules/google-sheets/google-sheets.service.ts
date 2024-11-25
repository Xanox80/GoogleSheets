import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private readonly logger = new Logger(GoogleSheetsService.name);
  private fileId: string;

  constructor(private readonly configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.configService.get<string>('GOOGLE_KEYFILE_PATH'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.fileId = this.configService.getOrThrow<string>('FILE_ID');
  }

  async fetchSheetRows(): Promise<{ id: number; data: any }[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.fileId,
        range: 'Sheet1',
      });
      const rows = response.data.values || [];
      const rowObjects = rows.map((row, index) => ({
        id: index + 1,
        data: row,
      }));
      return rowObjects;
    } catch (error) {
      this.logger.error('Error fetching rows from Google Sheet', error);
      throw error;
    }
  }
}
