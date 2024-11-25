import { Injectable, Logger } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { RowsService } from 'src/modules/rows/rows.service';
import { GoogleDriveService } from 'src/modules/google-drive/google-drive.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private logger: Logger;
  private senderEmail: string;

  constructor(
    private readonly sendGridService: SendgridService,
    private readonly rowsService: RowsService,
    private readonly driveService: GoogleDriveService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(EmailService.name);
    this.senderEmail = this.configService.getOrThrow<string>('SENDGRID_EMAIL');
  }

  async sendEmailOnNewRows(fileId: string): Promise<void> {
    const count = await this.rowsService.countRows();
    const status = await this.rowsService.getEmailStatus();

    if (count >= status.lastProcessedRow + 10) {
      const recepients = await this.driveService.getReceivers();

      if (!recepients.length) {
        this.logger.warn('No recepients found!');
      }

      await Promise.all(
        recepients.map((recepient) =>
          this.sendGridService.send({
            text: 'Check out the latest changes in the Google Sheet!',
            to: recepient,
            from: this.senderEmail,
          }),
        ),
      );

      this.logger.log(`Sent notification to ${recepients.length} users`);

      await this.rowsService.updateEmailStatus(count);
    }
  }
}
