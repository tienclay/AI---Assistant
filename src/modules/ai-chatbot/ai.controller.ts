import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AIService } from './ai.service';
import {
  AiAssistantApiResponse,
  CurrentUser,
  Roles,
} from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@entities';

import { AuthGuard } from '../auth/guard/auth.guard';
import {
  AssistantChatDto,
  AssistantChatResponse,
  CreateAssistantRun,
  CreateAssistantRunResponse,
} from './dto';
import { AssistantHistoryDto } from './dto/history.dto';
import { LoadKnowledgeDto } from './dto/load-knowledge.dto';

@Controller('ai-chatbot')
@ApiTags('AIChatbot-Service')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post(':chatbotId/load-knowledge')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  loadKnowledge(
    @CurrentUser() user: User,
    @Param('chatbotId') chatbotId: string,
    @Body() dto: LoadKnowledgeDto,
  ): Promise<boolean> {
    return this.aiService.loadKnowledge(
      user.id,
      chatbotId,
      dto.websiteUrls,
      dto.pdfUrls,
    );
  }

  @Post(':chatbotId/create-run')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(CreateAssistantRunResponse)
  createAgentRun(
    @Body() dto: CreateAssistantRun,
    @Param('chatbotId') chatbotId: string,
  ): Promise<CreateAssistantRunResponse> {
    return this.aiService.createAgentRun(chatbotId, dto.userId);
  }

  @Post(':chatbotId/chat')
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  AgentAssistantChat(
    @Body() dto: AssistantChatDto,
    @Param('chatbotId') chatbotId: string,
  ): Promise<AssistantChatResponse> {
    return this.aiService.sendMessage(chatbotId, dto);
  }

  @Post(':chatbotId/history')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  AgentAssistantHistory(
    @Body() dto: AssistantHistoryDto,
    @Param('chatbotId') chatbotId: string,
  ): Promise<AssistantChatResponse> {
    return this.aiService.sendHistory(chatbotId, dto);
  }
}
