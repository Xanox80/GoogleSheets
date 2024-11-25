import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { RowsService } from './rows.service';
import { RowsController } from './rows.controller';

@Module({
  controllers: [RowsController],
  providers: [RowsService, PrismaService],
  exports: [RowsService],
})
export class RowsModule {}
