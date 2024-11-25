import { ApiProperty } from '@nestjs/swagger';
import { EmailStatus, Row } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class EmailResponseDto {
  @ApiProperty({ example: '' })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  lastProcessedRow: number;

  @ApiProperty()
  @Expose()
  lastSentAt: Date;

  public static mapFrom(data: EmailStatus): EmailResponseDto {
    return plainToClass(EmailResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  public static mapFromMulti(data: EmailStatus[]): EmailResponseDto[] {
    return data.map(EmailResponseDto.mapFrom);
  }
}
