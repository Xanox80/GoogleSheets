import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class EmailDto {
  @ApiProperty({ example: '' })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  lastProcessedRow: number;

  @ApiProperty()
  @Expose()
  lastSentAt: Date;
}
