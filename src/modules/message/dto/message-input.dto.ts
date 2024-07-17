import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageSender } from 'src/common/enums';

export class MessageInputDto {
  @IsString()
  @ApiProperty({ example: 'hello' })
  content: string;

  @IsString()
  @ApiProperty({ example: '607561459247751168' })
  conversationId: string;

  @IsEnum(MessageSender)
  @ApiProperty({ example: MessageSender.BOT })
  messageSender: MessageSender;

  @IsOptional()
  @ApiProperty({ example: '' })
  participantId?: string;
}
