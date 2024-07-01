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
import { LoadKnowledgeDto } from './dto/load-knowledge.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import {
  AssistantChatDto,
  AssistantChatResponse,
  CreateAssistantRun,
  CreateAssistantRunResponse,
} from './dto';

@Controller()
@ApiTags('AI-Service')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post(':agentId/load-knowledge')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  loadKnowledge(
    @CurrentUser() user: User,
    @Param('agentId') agentId: string,
    @Body() dto: LoadKnowledgeDto,
  ): Promise<boolean> {
    return this.aiService.loadKnowledge(user.id, agentId, dto.urls);
  }

  @Post(':agentId/create-run')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(CreateAssistantRunResponse)
  createAgentRun(
    @Body() dto: CreateAssistantRun,
    @Param('agentId') agentId: string,
  ): Promise<CreateAssistantRunResponse> {
    return this.aiService.createAgentRun(agentId, dto.userId);
  }

  @Post(':agentId/chat')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(Boolean)
  AgentAssistantChat(
    @Body() dto: AssistantChatDto,
    @Param('agentId') agentId: string,
  ): Promise<AssistantChatResponse> {
    return this.aiService.sendMessage(agentId, dto);
  }
}
