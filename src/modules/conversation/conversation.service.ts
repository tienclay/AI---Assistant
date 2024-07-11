import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message } from '@entities';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversationInput = this.conversationRepository.create(
      createConversationDto,
    );
    return this.conversationRepository.save(conversationInput);
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
