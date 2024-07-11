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
import { CreateAssistantRunResponse } from '../ai-chatbot/dto';

@Controller('chatbot')
@ApiTags('Chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

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
    console.log('1111 :>> ', 1111);
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
}
