import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('conversation')
@ApiTags('Conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  // @Post('chat')
  // @HttpCode(HttpStatus.OK)
  // @AiAssistantApiResponse(Boolean)
  // AgentAssistantChat(
  //   @Body() dto: ChatDto,
  //   @Param('agentId') agentId: string,
  // ): Promise<AssistantChatResponse> {
  //   return this.aiService.sendMessage(agentId, dto);
  // }

  @Get()
  getParticipantConversation(@Param('participantId') participantId: string) {
    return this.conversationService.getParticipantConversation(participantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
