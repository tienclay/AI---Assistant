import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Injectable()
export class ChatbotService {
  create(createChatbotDto: CreateChatbotDto) {
    return 'This action adds a new chatbot';
  }

  findAll() {
    return `This action returns all chatbot`;
  }

  findOne(id: string) {
    return `This action returns a #${id} chatbot`;
  }

  update(id: string, updateChatbotDto: UpdateChatbotDto) {
    return `This action updates a #${id} chatbot`;
  }

  remove(id: string) {
    return `This action removes a #${id} chatbot`;
  }
}
