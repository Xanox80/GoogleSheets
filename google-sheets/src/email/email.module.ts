import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RowsService } from 'src/modules/rows/rows.service';
import { GoogleDriveService } from 'src/modules/google-drive/google-drive.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { SendgridService } from './sendgrid.service';

@Module({
  providers: [
    EmailService,
    SendgridService,
    RowsService,
    GoogleDriveService,
    ConfigService,
    PrismaService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
