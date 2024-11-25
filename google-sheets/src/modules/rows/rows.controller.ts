import { Controller, Get, Param } from '@nestjs/common';
import { RowsService } from './rows.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('rows')
export class RowsController {
  constructor(private readonly rowsService: RowsService) {}

  @ApiOperation({ description: 'Get all rows' })
  @Get()
  @ApiTags('Get all rows')
  async getAll(): Promise<any[]> {
    return this.rowsService.getAllRows();
  }

  @ApiOperation({ description: 'Get a row' })
  @ApiTags('Get rows by id')
  @Get(':id')
  async getById(@Param('id') id: number): Promise<any> {
    return this.rowsService.getRowById(id);
  }
}
