import { Agent } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { aiServiceUrl } from './constants';
import {
  AgentInfo,
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
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
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
    agentId: string,
    urls: string[],
  ): Promise<boolean> {
    await this.agentRepository.findOneByOrFail({
      id: agentId,
      userId: clientId,
    });

    const agentInfo =
      await this.getAgentCollectionNameAndPromptByAgentId(agentId);

    const loadKnowledgeInput: LoadKnowledgeInterface = {
      assistant: AiAssistantType.RAG_PDF,
      agent_collection_name: agentInfo.collectionName,
      urls,
      prompt: agentInfo.prompt,
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
    const agentInfo =
      await this.getAgentCollectionNameAndPromptByAgentId(agentId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: agentInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: agentInfo.prompt,
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
    const agentInfo =
      await this.getAgentCollectionNameAndPromptByAgentId(agentId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: agentInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: agentInfo.prompt,
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
    agentId: string,
    dto: AssistantHistoryDto,
  ): Promise<AssistantChatResponse> {
    const agentInfo =
      await this.getAgentCollectionNameAndPromptByAgentId(agentId);

    const chatInput: AgentHistory = {
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: agentInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      prompt: agentInfo.prompt,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.getAgentHistory, {
        ...chatInput,
      }),
    );

    // save res.data to a json file

    return plainToInstance(AssistantChatResponse, { data: res.data });
  }

  async clearRecordsInCollection(agentId: string): Promise<boolean> {
    const agentInfo =
      await this.getAgentCollectionNameAndPromptByAgentId(agentId);

    await this.dataSource.query(`DELETE FROM ai."${agentInfo.collectionName}"`);

    return true;
  }

  private async getAgentCollectionNameAndPromptByAgentId(
    agentId: string,
  ): Promise<AgentInfo> {
    const agent = await this.agentRepository.findOneOrFail({
      where: {
        id: agentId,
      },
    });

    return {
      collectionName: `${agent.companyName}:${agent.id}`,
      prompt: agent.prompt,
    };
  }
}
