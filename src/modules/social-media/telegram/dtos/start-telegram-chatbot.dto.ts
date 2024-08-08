import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartTelegramChatbotInputDto {
  @ApiProperty({
    description: 'The unique identifier of the Telegram chatbot to start',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  telegramChatbotId: string;
}

export class StartTelegramChatbotResponseDto {
  @ApiProperty({
    description: 'The message of the response',
    example: 'Telegram chatbot started',
  })
  message: string;
}
