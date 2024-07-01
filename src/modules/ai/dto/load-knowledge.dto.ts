import { ApiProperty } from '@nestjs/swagger';

export class LoadKnowledgeDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    format: 'binary',
    description: 'file supported: pdf,doc,docx,rtf,html, size: < 5MB',
  })
  urls: string[];
}
