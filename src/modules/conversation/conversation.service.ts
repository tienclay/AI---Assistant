import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AIService } from '../ai-chatbot/ai.service';
import { plainToInstance } from 'class-transformer';
import { ResponseConversationDto } from './dto/response-conversation.dto';
import { Conversation, Message } from '@entities';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly aiService: AIService,
  ) {}
  async create(dto: CreateConversationDto) {
    const [chatbotId, userId] = [dto.chatbotId, dto.participantId];

    const assistantRun = await this.aiService.createAgentRun(
      dto.chatbotId,
      dto.participantId,
    );
    const conversation = this.conversationRepository.create({
      id: assistantRun.conversationId,
      chatbotId,
      participantId: userId,
      title: dto.title,
    });
    const saveConversation =
      await this.conversationRepository.save(conversation);
    return plainToInstance(ResponseConversationDto, saveConversation);
  }

  getAllConversationByChatbotId(chatbotId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({ where: { chatbotId } });
  }

  getParticipantConversation(participantId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({ where: { participantId } });
  }

  getAllMessageInConversation(conversationId: string): Promise<Message[]> {
    return this.messageRepository.find({ where: { conversationId } });
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
