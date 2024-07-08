import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { ChatbotProperty } from 'database/entities/chatbot-property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatbotPropertyService {
  constructor(
    @InjectRepository(ChatbotProperty)
    private chatbotPropertyRepository: Repository<ChatbotProperty>,
  ) {}

  async getChatbotProperties(chatbotId: string): Promise<ChatbotProperty> {
    const property = await this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
    });

    return property;
  }
}
