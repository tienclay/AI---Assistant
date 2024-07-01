import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Roles,
  AiAssistantApiResponse,
  CurrentUser,
} from 'src/common/decorators';
import { UserRole } from 'src/common/enums/user.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CompanyAgentDto } from './dto';
import { Agent } from 'database/entities/agent.entity';
import { User } from '@entities';
import { PromptDto } from './dto/prompt-data.dto';

@Controller('agent')
@ApiTags('Agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(Agent)
  @Post()
  async create(@Body() userInputDto: CompanyAgentDto): Promise<Agent> {
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

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(PromptDto)
  @Post(':id')
  async uploadData(@Param('id') id: string, @Body() inputData: PromptDto) {
    return this.agentService.uploadPrompt(id, inputData);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(CompanyAgentDto, true)
  @Get()
  async getAllAgents(): Promise<CompanyAgentDto[]> {
    return this.agentService.getAllAgents();
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @AiAssistantApiResponse(PromptDto)
  @Get(':id')
  async getAgent(@Param('id') id: string): Promise<CompanyAgentDto> {
    return this.agentService.getAgentById(id);
  }
}
