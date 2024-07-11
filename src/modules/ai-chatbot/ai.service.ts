import { Chatbot } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { aiServiceUrl } from './constants';
import {
  chatbotInfo,
  AssistantChatInterface,
  CreateAssistantRunInterface,
  LoadKnowledgeInterface,
} from './interfaces';
import { AiAssistantType } from 'src/common/enums';
import { plainToInstance } from 'class-transformer';
import {
  AssistantChatDto,
  AssistantChatResponse,
  CreateAssistantRunResponse,
} from './dto';
import { AssistantHistoryDto } from './dto/history.dto';
import { AgentHistory } from './interfaces/history.interface';

@Injectable()
export class AIService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    @InjectDataSource('cv-parser')
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description Create a new table in Ai Service
   * @param {string} tableName - The table name based on company name
   * @return {Promise<Boolean>} A promise that resolves to the parsed response.
   * @throws {InternalServerError} If there is an error during the parsing process.
   */

  async createTable(tableName: string): Promise<boolean> {
    try {
      const response = await this.httpService
        .post('/table', { tableName })
        .toPromise();
      return response.data;
    } catch (error) {
      throw new Error('Error creating table');
    }
  }

  async loadKnowledge(
    clientId: string,
    chatbotId: string,
    websiteUrls?: string[],
    pdfUrls?: string[],
  ): Promise<boolean> {
    await this.chatbotRepository.findOneByOrFail({
      id: chatbotId,
      createdById: clientId,
    });

    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const loadKnowledgeInput: LoadKnowledgeInterface = {
      assistant: AiAssistantType.RAG_PDF,
      agent_collection_name: chatbotInfo.collectionName,
      website_urls: websiteUrls,
      pdf_urls: pdfUrls,
      prompt: chatbotInfo.prompt,
    };

    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        ...loadKnowledgeInput,
      }),
    );

    return true;
  }

  async createAgentRun(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: chatbotInfo.prompt,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.createAssistantRun, {
        ...createAssistantRun,
      }),
    );

    return plainToInstance(CreateAssistantRunResponse, {
      runId: res.data.run_id,
      userId: res.data.user_id,
      chatHistory: res.data.chat_history,
    });
  }

  async sendMessage(
    chatbotId: string,
    dto: AssistantChatDto,
  ): Promise<AssistantChatResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: chatbotInfo.prompt,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    // save res.data to a json file

    return plainToInstance(AssistantChatResponse, { data: res.data });
  }

  async sendHistory(
    chatbotId: string,
    dto: AssistantHistoryDto,
  ): Promise<AssistantChatResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AgentHistory = {
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: chatbotInfo.prompt,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.getAgentHistory, {
        ...chatInput,
      }),
    );

    // save res.data to a json file

    return plainToInstance(AssistantChatResponse, { data: res.data });
  }

  async clearRecordsInCollection(chatbotId: string): Promise<boolean> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    await this.dataSource.query(
      `DELETE FROM ai."${chatbotInfo.collectionName}"`,
    );

    return true;
  }

  private async getAgentCollectionNameAndPromptByChatbotId(
    chatbotId: string,
  ): Promise<chatbotInfo> {
    const chatbot = await this.chatbotRepository.findOneOrFail({
      where: {
        id: chatbotId,
      },
    });

    return {
      collectionName: `${chatbot.name}:${chatbot.id}`,
      prompt: chatbot.prompt,
    };
  }
}
