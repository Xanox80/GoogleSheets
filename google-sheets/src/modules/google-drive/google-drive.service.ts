import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleDriveService implements OnModuleInit {
  private drive: drive_v3.Drive;
  private readonly logger = new Logger(GoogleDriveService.name);
  private serverUrl: string;
  private subscriptions: Record<string, string> = {};
  private readonly fileId: string;

  constructor(private readonly configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.configService.get<string>('GOOGLE_KEYFILE_PATH'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });

    this.serverUrl = this.configService.getOrThrow<string>('SERVER_URL');
    this.fileId = this.configService.getOrThrow<string>('FILE_ID');
    this.storeSubscription();
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Google Drive watch subscription...');
    try {
      await this.storeSubscription();
      await this.watchFile();
    } catch (error) {
      this.logger.error(
        'Failed to initialize Google Drive watch subscription:',
        error.message,
      );
    }
  }

  async watchFile(): Promise<void> {
    try {
      const channelId = await this.getChannelId();
      const response = await this.drive.files.watch({
        fileId: this.fileId,
        requestBody: {
          id: channelId,
          type: 'web_hook',
          address: `${this.serverUrl}/webhooks/google-drive`,
        },
      });

      this.logger.log(`Subscribed to changes for file ${this.fileId}`);
      this.logger.log(`Channel resource ID: ${response.data.resourceId}`);
    } catch (error) {
      this.logger.error('Error setting up watch: ', error.message);
      throw error;
    }
  }

  async getReceivers(): Promise<string[]> {
    try {
      const response = await this.drive.permissions.list({
        fileId: this.fileId,
        fields: 'permissions(emailAdress)',
      });

      const permissions = response.data.permissions || [];
      const emails = permissions
        .map((permission) => permission.emailAddress)
        .filter((email) => !!email);

      this.logger.log(`Found ${emails?.length} receivers`);
      return emails;
    } catch (error) {
      this.logger.error('Error fetching file permissions: ', error);
      throw error;
    }
  }

  async storeSubscription(): Promise<void> {
    this.subscriptions[this.fileId] = uuidv4();
  }

  async getChannelId(): Promise<string | undefined> {
    return this.subscriptions[this.fileId];
  }
}
