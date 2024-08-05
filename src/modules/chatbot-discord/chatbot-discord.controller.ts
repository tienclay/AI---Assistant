import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ChatbotDiscordService } from './chatbot-discord.service';
import { CreateChatbotDiscordDto } from './dtos/create-chatbot-discord.dto';
import { AiAssistantApiResponse, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { CreateChatbotDiscordResponseDto } from './dtos/create-chatbot-discord-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('chatbot-discord')
@ApiTags('Chatbot Discord')
export class ChatbotDiscordController {
  constructor(private readonly chatbotDiscordService: ChatbotDiscordService) {}
  // Add methods for CRUD operations
  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(CreateChatbotDiscordResponseDto, true)
  create(@Body() createChatbotDiscordDto: CreateChatbotDiscordDto) {
    return this.chatbotDiscordService.create(createChatbotDiscordDto);
  }

  @Get()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(CreateChatbotDiscordResponseDto, true)
  findAll() {
    return this.chatbotDiscordService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(CreateChatbotDiscordResponseDto)
  findOne(@Param('id') id: string) {
    return this.chatbotDiscordService.findOne(id);
  }
}
