import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatbotDto } from './create-chatbot.dto';
import { ChatbotPersonaDto, ChatbotPromptDto } from './chatbot-property.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  persona: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  prompt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  instruction: string;
}
