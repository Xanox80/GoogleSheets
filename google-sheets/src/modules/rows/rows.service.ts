import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RowsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRow(data: any): Promise<void> {
    await this.prisma.row.create({ data: { rowData: data } });
  }

  async getAllRows(): Promise<any[]> {
    return this.prisma.row.findMany();
  }

  async getRowById(id: number): Promise<any> {
    return this.prisma.row.findUnique({ where: { id } });
  }

  async countRows(): Promise<number> {
    return this.prisma.row.count();
  }

  async storeRows(rows: { id: number; data: any[] }[]): Promise<void> {
    await this.prisma.$transaction(async () => {
      for (const row of rows) {
        this.prisma.row.upsert({
          where: { id: row.id },
          create: {
            rowData: row.data,
            createdAt: new Date(),
          },
          update: {
            rowData: row.data,
          },
        });
      }
    });
  }

  async getEmailStatus(): Promise<{ lastProcessedRow: number }> {
    const status = await this.prisma.emailStatus.findFirst();
    if (!status) {
      return await this.prisma.emailStatus.create({
        data: {
          lastProcessedRow: 0,
        },
      });
    }
    return status;
  }

  async updateEmailStatus(lastProcessedRow: number): Promise<void> {
    await this.prisma.emailStatus.deleteMany();
    await this.prisma.emailStatus.create({
      data: {
        lastProcessedRow,
      },
    });
  }
}
