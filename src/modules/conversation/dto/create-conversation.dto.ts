import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @ApiProperty()
  chatbotId: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  title: string;

  @IsString()
  @ApiProperty()
  participantId: string;
}
