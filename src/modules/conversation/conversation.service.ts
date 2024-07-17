import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponseConversationDto } from './dto/response-conversation.dto';
import { Conversation, Message } from '@entities';
import { Repository } from 'typeorm';
import { AIAssistantNotFoundException } from 'src/common/infra-exception';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(dto: CreateConversationDto) {
    const [id, chatbotId, userId] = [dto.id, dto.chatbotId, dto.participantId];

    const conversation = this.conversationRepository.create({
      id,
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

  async getAllMessageInConversation(
    conversationId: string,
  ): Promise<Message[]> {
    const conversation = this.conversationRepository.find({
      where: {
        id: conversationId,
      },
    });
    if (!conversation) {
      throw new AIAssistantNotFoundException('Not found conversation');
    }
    return this.messageRepository.find({ where: { conversationId } });
  }

  async getAllConversations(): Promise<ResponseConversationDto[]> {
    const conversations = await this.conversationRepository.find();
    return conversations.map((conversation) =>
      plainToInstance(ResponseConversationDto, conversation),
    );
  }

  update(id: string, updateConversationDto: UpdateConversationDto) {
    return this.conversationRepository.update(id, updateConversationDto);
  }

  updateMessage(id: string, messageId: string) {
    return this.conversationRepository.update(id, { lastMessageId: messageId });
  }

  remove(id: string) {
    return this.conversationRepository.delete(id);
  }
}
