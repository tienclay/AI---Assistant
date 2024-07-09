import { Injectable } from '@nestjs/common';
import { ChatbotProperty } from 'database/entities/chatbot-property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  ChatbotPersonaDto,
  ChatbotPromptDto,
} from './dto/chatbot-property.dto';
import { Knowledge, Persona } from '@entities';
import { AIAssistantBadRequestException } from 'src/common/infra-exception';
import { ChatbotKnowledgeDto } from './dto';

@Injectable()
export class ChatbotPropertyService {
  constructor(
    @InjectRepository(ChatbotProperty)
    private chatbotPropertyRepository: Repository<ChatbotProperty>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    private dataSource: DataSource,
  ) {}

  async getChatbotProperties(chatbotId: string): Promise<ChatbotProperty> {
    const property = await this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
    });

    return property;
  }

  async addingPersona(
    chatbotId: string,
    personaProperty: ChatbotPersonaDto,
  ): Promise<ChatbotProperty> {
    const property = await this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
    });

    if (property.personaId) {
      throw new Error('This chatbot already has a persona');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const persona = await queryRunner.manager.save(Persona, {
        ...personaProperty,
        chatbotId,
      });

      await queryRunner.manager.update(ChatbotProperty, property.id, {
        personaId: persona.id,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AIAssistantBadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }

    return this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
      relations: ['persona', 'prompt', 'knowledge'],
    });
  }

  async addingPrompt(
    chatbotId: string,
    promptProperty: ChatbotPromptDto,
  ): Promise<ChatbotProperty> {
    const property = await this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
    });

    if (property.promptId) {
      throw new Error('This chatbot already has a persona');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prompt = await queryRunner.manager.save(Persona, {
        ...promptProperty,
        chatbotId,
      });

      await queryRunner.manager.update(ChatbotProperty, property.id, {
        promptId: prompt.id,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AIAssistantBadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }

    return this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
      relations: ['persona', 'prompt', 'knowledge'],
    });
  }

  async loadChatbotKnowledge(
    chatbotId: string,
    userId: string,
    knowledgeDto: ChatbotKnowledgeDto,
  ): Promise<boolean> {
    const property = await this.chatbotPropertyRepository.findOne({
      where: { chatbotId },
    });

    if (property.knowledgeId) {
      throw new Error('This chatbot already has knowledge');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const knowledge = await queryRunner.manager.save(Knowledge, {
        ...knowledgeDto,
        chatbotId,
      });

      await queryRunner.manager.update(ChatbotProperty, property.id, {
        knowledgeId: knowledge.id,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AIAssistantBadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }

    return true;
  }
}
