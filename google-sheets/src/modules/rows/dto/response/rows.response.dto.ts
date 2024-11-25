import { ApiProperty } from '@nestjs/swagger';
import { Row } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class RowsResponseDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  rowData: JSON;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  public static mapFrom(data: Row): RowsResponseDto {
    return plainToClass(RowsResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  public static mapFromMulti(data: Row[]): RowsResponseDto[] {
    return data.map(RowsResponseDto.mapFrom);
  }
}
