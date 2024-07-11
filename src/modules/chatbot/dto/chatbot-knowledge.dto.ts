import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class ChatbotKnowledgeDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  plainText: string;

  @IsUrl({}, { each: true })
  @ApiProperty()
  @IsOptional()
  websiteUrls: string[];

  @IsUrl({}, { each: true })
  @ApiProperty()
  @IsOptional()
  pdfUrls: string[];
}
