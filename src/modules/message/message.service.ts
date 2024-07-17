import { Message } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageInputDto, MessageOutputDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async createMessage(message: MessageInputDto): Promise<MessageOutputDto> {
    const createdMessage = this.messageRepository.create(message);
    await this.messageRepository.save(createdMessage);
    return plainToInstance(MessageOutputDto, createdMessage);
  }

  async getAllMessages(): Promise<MessageOutputDto[]> {
    const messages = await this.messageRepository.find();
    return messages.map((message) =>
      plainToInstance(MessageOutputDto, message),
    );
  }
  async getAllMessageByConversationId(id: string): Promise<MessageOutputDto[]> {
    const messages = await this.messageRepository.find({
      where: {
        conversationId: id,
      },
    });
    return messages.map((message) =>
      plainToInstance(MessageOutputDto, message),
    );
  }
}
