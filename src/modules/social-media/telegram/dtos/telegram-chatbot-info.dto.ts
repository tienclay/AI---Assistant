import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class TelegramChatbotDto {
  @IsString()
  @ApiProperty({ type: String, format: 'uuid' })
  chatbotId: string;

  @IsString()
  @ApiProperty({ type: String, format: 'uuid' })
  accountId: string;

  @IsString()
  @ApiProperty()
  telegramChatbotId: string;

  @IsString()
  @ApiProperty()
  token: string;
}
