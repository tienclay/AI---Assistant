import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TelegramChatbotDto {
  @IsString()
  @ApiProperty({ type: String, format: 'uuid' })
  chatbotId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, format: 'uuid' })
  accountId: string;

  @IsString()
  @ApiProperty()
  telegramChatbotId: string;

  @IsString()
  @ApiProperty()
  token: string;
}
