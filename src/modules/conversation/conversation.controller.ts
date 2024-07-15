import { MessageService } from './../message/message.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard';
import { AiAssistantApiResponse, Roles } from 'src/common/decorators';
import { ResponseConversationDto } from './dto/response-conversation.dto';
import { UserRole } from 'src/common/enums';

@Controller('conversation')
@ApiTags('Conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @AiAssistantApiResponse(ResponseConversationDto)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.CLIENT)
  create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ResponseConversationDto> {
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
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }

  @Get(':id/get-all-messages')
  getAllMessages(@Param('conversationId') conversationId: string) {
    return this.messageService.getAllMessageByConversationId(conversationId);
  }

  @Get('all-conversations')
  getAllConversations() {
    return this.conversationService.getAllConversations();
  }

  @Patch(':id/update-last-message')
  updateLastMessage(@Param('id') id: string, @Body() message: string) {
    return this.conversationService.updateMessage(id, message);
  }
}
