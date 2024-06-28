import { Agent } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { aiServiceUrl } from './constants';
import { LoadKnowledgeInterface } from './interfaces';
import { AiAssistantType } from 'src/common/enums';

@Injectable()
export class AIService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
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

  async loadKnowledge(clientId: string, urls: string[]): Promise<boolean> {
    const agent = await this.agentRepository.findOne({
      where: {
        userId: clientId,
      },
    });

    const agentName = await this.getAgentCollectionName(agent);

    const loadKnowledgeInput: LoadKnowledgeInterface = {
      assistant: AiAssistantType.RAG_PDF,
      agent_collection_name: agentName,
      urls,
    };

    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        body: loadKnowledgeInput,
      }),
    );

    return true;
  }

  private async getAgentCollectionName(agent: Agent): Promise<string> {
    return `${agent.companyName}:${agent.id}`;
  }
}
