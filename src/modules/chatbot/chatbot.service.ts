import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatbot, Knowledge } from '@entities';
import { Repository } from 'typeorm';
import { AIAssistantForbiddenException } from 'src/common/infra-exception';
import { ChatbotKnowledgeDto, UpdateChatbotDto } from './dto';
import { AIService } from '../ai-chatbot/ai.service';
import { CreateAssistantRunResponse } from '../ai-chatbot/dto';
import * as samplePropertyJson from './json/sample-property.json';
import { ChatbotSampleProperty } from './dto/chatbot-response.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
    private readonly aiService: AIService,
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
    const chatbot = await this.chatbotRepository
      .createQueryBuilder('chatbot')
      .leftJoinAndMapOne(
        'chatbot.knowledge',
        Knowledge,
        'knowledge',
        'knowledge.chatbot_id = chatbot.id',
      )
      .where('chatbot.id = :chatbotId', { chatbotId: id })
      .getOne();

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

    if (updated.affected === 0) {
      return false;
    }

    return true;
  }

  async getSampleProperty(): Promise<ChatbotSampleProperty> {
    return samplePropertyJson;
  }

  async loadChatbotKnowledge(
    chatbotId: string,
    userId: string,
    dto: ChatbotKnowledgeDto,
  ) {
    await this.getChatbotWithUserId(chatbotId, userId);
    const curChatbotKnowledge = await this.knowledgeRepository.findOne({
      where: { chatbotId },
    });
    if (curChatbotKnowledge)
      await this.knowledgeRepository.delete(curChatbotKnowledge.id);
    await this.knowledgeRepository.save({
      ...dto,
      chatbotId,
    });

    const chatbotKnowledge = await this.chatbotRepository
      .createQueryBuilder('chatbot')
      .leftJoinAndMapOne(
        'chatbot.knowledge',
        Knowledge,
        'knowledge',
        'knowledge.chatbot_id = chatbot.id',
      )
      .where('chatbot.id = :chatbotId', { chatbotId })
      .getOne();

    return chatbotKnowledge;
  }

  async loadChatbotKnowledgeToAi(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    await this.getChatbotWithUserId(chatbotId, userId);
    const chatbotKnowledge = await this.knowledgeRepository.findOne({
      where: { chatbotId },
    });
    // call AI service to load knowledge
    await this.aiService.loadKnowledge(
      userId,
      chatbotId,
      chatbotKnowledge.websiteUrls || [],
      chatbotKnowledge.pdfUrls || [],
    );

    return this.aiService.createAgentRun(chatbotId, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.chatbotRepository.softDelete({
      id,
      createdById: userId,
    });
  }
}
