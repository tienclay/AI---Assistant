import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @ApiProperty({ example: '' })
  chatbotId: string;

  @IsString()
  @ApiProperty({ example: '' })
  title: string | null;

  @IsString()
  @ApiProperty({ example: '' })
  participantId: string;
}
