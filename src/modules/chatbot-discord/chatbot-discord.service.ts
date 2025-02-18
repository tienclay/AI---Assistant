import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';
import { Repository } from 'typeorm';
import { CreateChatbotDiscordDto } from './dtos/create-chatbot-discord.dto';
import { decrypt, encrypt } from 'src/common/utils/crypto-aes.util';

@Injectable()
export class ChatbotDiscordService {
  constructor(
    @InjectRepository(ChatbotDiscord)
    private readonly chatbotDiscordRepository: Repository<ChatbotDiscord>,
  ) {}

  async create(dto: CreateChatbotDiscordDto) {
    const chatbotDiscordInfo = {
      discordToken: encrypt(dto.discordToken),
      publicKey: encrypt(dto.publicKey),
      appId: dto.appId,
    };
    this.chatbotDiscordRepository.create(chatbotDiscordInfo);
    await this.chatbotDiscordRepository.save(chatbotDiscordInfo);
  }
  async findAll(): Promise<ChatbotDiscord[]> {
    return await this.chatbotDiscordRepository.find();
  }

  async findOne(id: string): Promise<ChatbotDiscord> {
    return await this.chatbotDiscordRepository.findOneByOrFail({ id });
  }

  async getChatbotDiscordByAppId(appId: string): Promise<ChatbotDiscord> {
    const hashInfo = await this.chatbotDiscordRepository.findOneByOrFail({
      appId,
    });
    return {
      ...hashInfo,
      discordToken: decrypt(hashInfo.discordToken),
      publicKey: decrypt(hashInfo.publicKey),
    };
  }
}
