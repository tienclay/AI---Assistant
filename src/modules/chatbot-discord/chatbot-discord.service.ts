import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';
import { Repository } from 'typeorm';
import { CreateChatbotDiscordDto } from './dtos/create-chatbot-discord.dto';

@Injectable()
export class ChatbotDiscordService {
  constructor(
    @InjectRepository(ChatbotDiscord)
    private readonly chatbotDiscordRepository: Repository<ChatbotDiscord>,
  ) {}
  async create(dto: CreateChatbotDiscordDto) {
    this.chatbotDiscordRepository.create(dto);
    await this.chatbotDiscordRepository.save(dto);
  }
  async findAll(): Promise<ChatbotDiscord[]> {
    return await this.chatbotDiscordRepository.find();
  }

  async findOne(id: string): Promise<ChatbotDiscord> {
    return await this.chatbotDiscordRepository.findOneByOrFail({ id });
  }

  async getChatbotDiscordByAppId(appId: string): Promise<ChatbotDiscord> {
    return await this.chatbotDiscordRepository.findOneByOrFail({ appId });
  }
}
