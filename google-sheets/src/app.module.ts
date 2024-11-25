import { Module } from '@nestjs/common';
import { SheetsGateway } from './common/gateway/sheets.gateway';
import { RowsModule } from './modules/rows/rows.module';
import { GoogleDriveWebhookController } from './webhooks/google-drive.webhook.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { EmailModule } from './email/email.module';
import { GoogleDriveService } from './modules/google-drive/google-drive.service';
import { GoogleSheetsService } from './modules/google-sheets/google-sheets.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [RowsModule, PrismaModule, EmailModule],
  controllers: [GoogleDriveWebhookController],
  providers: [
    SheetsGateway,
    PrismaService,
    GoogleDriveService,
    GoogleSheetsService,
    ConfigService,
  ],
})
export class AppModule {}
