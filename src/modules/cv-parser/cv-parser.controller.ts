import { Controller, Get, Query } from '@nestjs/common';
import { CvParserService } from './cv-parser.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('cv-parser')
@ApiTags('cv-parser')
export class CvParserController {
  constructor(private readonly cvParserService: CvParserService) {}

  @Get()
  @ApiQuery({ name: 'url', required: true })
  async parseCv(@Query('url') url: string): Promise<any> {
    return this.cvParserService.uploadAndParseCv(url);
  }
}
