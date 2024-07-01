import { Agent } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { aiServiceUrl } from './constants';
import {
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

@Injectable()
export class AIService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async onModuleInit(): Promise<void> {
    // const test = await this.createAgentRun(
    //   '27416e60-de2f-4bd6-8efd-40d5d6a7dfb0',
    //   'thanh',
    // );
    // const test = await this.sendMessage(
    //   '2c56101e-5100-47ee-89f1-e55ebc3ca006',
    //   {
    //     message: 'Hello',
    //     runId: '62779234-f1c3-4c45-ad51-1f5972590b7c',
    //     userId: 'thanh',
    //   },
    // );
    // console.log('test :>> ', test);
  }

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
    agentId: string,
    urls: string[],
  ): Promise<boolean> {
    await this.agentRepository.findOneByOrFail({
      id: agentId,
      userId: clientId,
    });

    const agentName = await this.getAgentCollectionNameByAgentId(agentId);

    const loadKnowledgeInput: LoadKnowledgeInterface = {
      assistant: AiAssistantType.RAG_PDF,
      agent_collection_name: agentName,
      urls,
    };

    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        ...loadKnowledgeInput,
      }),
    );

    return true;
  }

  async createAgentRun(
    agentId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const collectionName = await this.getAgentCollectionNameByAgentId(agentId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: collectionName,
      assistant: AiAssistantType.RAG_PDF,
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
    agentId: string,
    dto: AssistantChatDto,
  ): Promise<AssistantChatResponse> {
    const collectionName = await this.getAgentCollectionNameByAgentId(agentId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: collectionName,
      assistant: AiAssistantType.RAG_PDF,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    return plainToInstance(AssistantChatResponse, res.data);
  }

  private async getAgentCollectionNameByAgentId(
    agentId: string,
  ): Promise<string> {
    const agent = await this.agentRepository.findOneOrFail({
      where: {
        id: agentId,
      },
    });

    return `${agent.companyName}:${agent.id}`;
  }
}
