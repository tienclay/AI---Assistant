import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from '../auth/guard';
import {
  AiAssistantApiResponse,
  CurrentUser,
  Roles,
} from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { User } from '@entities';
import {
  ChatbotResponse,
  ChatbotSampleProperty,
} from './dto/chatbot-response.dto';
import { ChatbotKnowledgeDto } from './dto';
import {
  CreateAssistantRun,
  CreateAssistantRunResponse,
} from '../ai-chatbot/dto';
import {
  AssistantChatDto,
  AssistantChatHistoryDto,
  AssistantChatResponse,
} from './dto/chat.dto';
import { AIService } from '../ai-chatbot/ai.service';

@Controller('chatbot')
@ApiTags('Chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly aiService: AIService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new chat bot' })
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(ChatbotResponse)
  createCompanyChatbot(
    @Body() createChatbotDto: CreateChatbotDto,
    @CurrentUser() user: User,
  ) {
    return this.chatbotService.createChatbot(user.id, createChatbotDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all user client chat bot' })
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(ChatbotResponse)
  getAllCompanyChatbot(@CurrentUser() user: User) {
    return this.chatbotService.getAllCompanyChatbot(user.id);
  }

  @Get('sample-property')
  @ApiOperation({ summary: 'Get all chat bot sample properties' })
  @AiAssistantApiResponse(ChatbotSampleProperty)
  getChatbotProperty() {
    return this.chatbotService.getSampleProperty();
  }
  @Get('all-models')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all models' })
  @ApiBearerAuth('access-token')
  getAllModels(): string[] {
    return this.chatbotService.getALlModels();
  }
  @Patch(':id/load-knowledge')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a chat bot' })
  loadChatbotKnowledge(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: ChatbotKnowledgeDto,
  ) {
    return this.chatbotService.loadChatbotKnowledge(id, user.id, dto);
  }

  @Post(':id/load-knowledge')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a chat bot' })
  loadChatbotKnowledgeToAi(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<CreateAssistantRunResponse> {
    return this.chatbotService.loadChatbotKnowledgeToAi(id, user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a chat bot' })
  @ApiBearerAuth('access-token')
  getChatbot(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatbotService.getChatbotWithUserId(id, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Update a chat bot' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateChatbotDto: UpdateChatbotDto,
  ) {
    return this.chatbotService.update(id, user.id, updateChatbotDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Delete a chat bot' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatbotService.remove(id, user.id);
  }

  @Post(':id/chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message chat' })
  conversationChat(
    @Param('id') id: string,
    @Body() dto: AssistantChatDto,
  ): Promise<AssistantChatResponse> {
    return this.aiService.sendDirectMessage(id, dto);
  }

  @Post(':id/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message chat history' })
  conversationChatHistory(
    @Param('id') id: string,
    @Body() dto: AssistantChatHistoryDto,
  ): Promise<AssistantChatResponse> {
    return this.aiService.sendHistory(id, dto);
  }

  @Post(':id/create-run')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @AiAssistantApiResponse(CreateAssistantRunResponse)
  createAgentRun(
    @Body() dto: CreateAssistantRun,
    @Param('id') chatbotId: string,
  ): Promise<CreateAssistantRunResponse> {
    return this.aiService.createAgentRun(chatbotId, dto.userId);
  }
}
