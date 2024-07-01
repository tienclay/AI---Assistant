import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  AiAssistantApiResponse,
  CurrentUser,
} from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateCompanyAgentDto } from './dto';
import { Agent } from 'database/entities/agent.entity';
import { User } from '@entities';

@Controller('agent')
@ApiTags('Agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(Agent)
  @Post()
  async create(@Body() userInputDto: CreateCompanyAgentDto): Promise<Agent> {
    return this.agentService.createAgent(userInputDto);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.CLIENT)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(Agent, true)
  @Get()
  getClientAgent(@CurrentUser() agent: User): Promise<Agent[]> {
    return this.agentService.getAgentByClientId(agent.id);
  }
}
