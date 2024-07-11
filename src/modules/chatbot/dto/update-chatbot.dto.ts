import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatbotDto } from './create-chatbot.dto';
import { ChatbotPersonaDto, ChatbotPromptDto } from './chatbot-property.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Instruction, Persona } from 'src/common/enums';

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  persona: Persona[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  prompt: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  instruction: Instruction[];
}
