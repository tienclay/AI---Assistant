import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { ChatbotPropertyService } from './chatbot-property.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatbot } from '@entities';
import { Repository } from 'typeorm';
import { AIAssistantForbiddenException } from 'src/common/infra-exception';
import { ChatbotKnowledgeDto } from './dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    private readonly chatbotPropertyService: ChatbotPropertyService,
  ) {}

  createChatbot(userId: string, dto: CreateChatbotDto): Promise<Chatbot> {
    const chatbotInput = this.chatbotRepository.create({
      ...dto,
      createdById: userId,
    });
    return this.chatbotRepository.save(chatbotInput);
  }

  getAllCompanyChatbot(userId: string): Promise<Chatbot[]> {
    return this.chatbotRepository.find({ where: { createdById: userId } });
  }

  async getChatbotWithUserId(id: string, userId: string): Promise<Chatbot> {
    const chatbot = await this.chatbotRepository.findOne({
      where: { id },
    });

    if (chatbot.createdById !== userId) {
      throw new AIAssistantForbiddenException(
        'You are not allowed to access this chatbot',
      );
    }
    return chatbot;
  }

  async update(
    id: string,
    userId: string,
    updateChatbotDto: UpdateChatbotDto,
  ): Promise<boolean> {
    // check if user id is owner of this chatbot or not
    await this.getChatbotWithUserId(id, userId);

    const updated = await this.chatbotRepository.update(id, updateChatbotDto);

    let propertyUpdate = false;
    if (updateChatbotDto.persona) {
      await this.chatbotPropertyService.addingPersona(
        id,
        updateChatbotDto.persona,
      );
      propertyUpdate = true;
    }

    if (updateChatbotDto.prompt) {
      await this.chatbotPropertyService.addingPrompt(
        id,
        updateChatbotDto.prompt,
      );
      propertyUpdate = true;
    }

    if (updated.affected === 0 && !propertyUpdate) {
      return false;
    }

    return true;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.chatbotRepository.softDelete({
      id,
      createdById: userId,
    });
  }
}
