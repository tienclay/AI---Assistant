import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file supported: jpg, jpeg, png, size: < 5MB',
  })
  file?: Express.Multer.File;
}
export class UploadFileResponseDto {
  @ApiProperty()
  id: string;

  constructor(file: UploadFileResponseDto) {
    this.id = file.id;
  }
}
