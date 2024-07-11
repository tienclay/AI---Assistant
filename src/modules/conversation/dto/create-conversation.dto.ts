import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @ApiProperty({ example: '' })
  chatbotId: string;

  @IsString()
  @ApiProperty({ example: '' })
  @IsOptional()
  title: string | null;

  @IsString()
  @ApiProperty({ example: '' })
  participantId: string;
}
