import { Inject, Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '@entities';
import { Repository } from 'typeorm';
import { AIService } from '../ai-chatbot/ai.service';
import { UserInputDto } from '../admin/dto';
import { plainToInstance } from 'class-transformer';
import { ResponseConversationDto } from './dto/response-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly aiService: AIService,
  ) {}
  async create(createConversationDto: CreateConversationDto) {
    const chatbotId = createConversationDto.chatbotId;
    const userId = createConversationDto.participantId;
    const assistantRun = await this.aiService.createAgentRun(chatbotId, userId);
    const conversation = this.conversationRepository.create({
      id: assistantRun.runId,
      chatbotId,
      participantId: userId,
      title: createConversationDto.title,
    });
    const saveConversation =
      await this.conversationRepository.save(conversation);
    return plainToInstance(ResponseConversationDto, saveConversation);
  }

  findAll() {
    return `This action returns all conversation`;
  }

  getParticipantConversation(participantId: string) {}

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
