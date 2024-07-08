import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatbotKnowledgeDto {
  @IsString()
  @ApiProperty()
  plainText: string;

  @IsString({ each: true })
  @ApiProperty()
  websiteUrls: string[];

  @IsString({ each: true })
  @ApiProperty()
  pdfUrls: string[];
}
