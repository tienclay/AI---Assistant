import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatbotDto } from './create-chatbot.dto';
import { ChatbotPersonaDto, ChatbotPromptDto } from './chatbot-property.dto';

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {
  @ApiProperty()
  persona: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  instruction: string;
}
