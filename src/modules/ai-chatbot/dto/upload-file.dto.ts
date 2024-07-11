import { ApiProperty } from '@nestjs/swagger';

export class UploadCvDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file supported: pdf,doc,docx,rtf,html, size: < 5MB',
  })
  file: Express.Multer.File;
}
