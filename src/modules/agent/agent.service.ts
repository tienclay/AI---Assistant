import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'database/entities/agent.entity';
import { Repository } from 'typeorm';
import { CreateCompanyAgentDto } from './dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async createAgent(createCompanyDto: CreateCompanyAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create(createCompanyDto);
    return await this.agentRepository.save(agent);
  }

  async getAgentByClientId(clientId: string): Promise<Agent[]> {
    return this.agentRepository.find({ where: { userId: clientId } });
  }
}
