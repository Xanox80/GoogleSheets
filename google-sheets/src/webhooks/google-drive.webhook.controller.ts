import { Controller, Post, Req, Logger } from '@nestjs/common';
import { Request } from 'express';
import { SheetsGateway } from './../common/gateway/sheets.gateway';
import { EmailService } from 'src/email/email.service';
import { GoogleDriveService } from 'src/modules/google-drive/google-drive.service';
import { GoogleSheetsService } from 'src/modules/google-sheets/google-sheets.service';
import { RowsService } from 'src/modules/rows/rows.service';

@Controller('webhooks/google-drive')
export class GoogleDriveWebhookController {
  private readonly logger = new Logger(GoogleDriveWebhookController.name);

  constructor(
    private readonly sheetsGateway: SheetsGateway,
    private readonly emailService: EmailService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly rowsService: RowsService,
  ) {}

  @Post()
  async handleFileChange(@Req() req: Request): Promise<void> {
    const fileId = req.headers['x-goog-resource-id'] as string;
    const changeType = req.headers['x-goog-resource-state'];

    this.logger.log(
      `File change detected: File ID: ${fileId}, Change Type: ${changeType}`,
    );

    const updatedRows = await this.googleSheetsService.fetchSheetRows();
    await this.rowsService.storeRows(updatedRows);

    this.sheetsGateway.sendNotification(`File ${fileId} was updated.`);
    await this.emailService.sendEmailOnNewRows(fileId);
  }
}
