import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { ParseCvResponseDto } from './dto/cv-parser-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '@entities';
import { extractJSONObject } from 'src/common/utils/extract-json.util';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CvParserService {
  constructor(
    private readonly aiService: AIService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async uploadAndParseCv(url: string): Promise<any> {
    const agent = await this.agentRepository.findOneByOrFail({
      companyName: 'CV Parser',
    });

    await this.aiService.loadKnowledge(agent.userId, agent.id, [url]);

    const agentRun = await this.aiService.createAgentRun(agent.id, 'parse-cv');

    const message = await this.aiService.sendMessage(agent.id, {
      message: 'Parse this Cv into Json for me',
      runId: agentRun.runId,
      userId: agentRun.userId,
    });

    const jsonObj = extractJSONObject(message.data);

    const parseCvRes = plainToInstance(ParseCvResponseDto, {
      ...jsonObj['personalInformation'],
      workExperiences: jsonObj['WorkExperience'] || jsonObj['workExperience'],
      educations: jsonObj['Education'] || jsonObj['education'],
      skills: jsonObj['Skills'] || jsonObj['skills'],
      languages: jsonObj['Languages'] || jsonObj['languages'],
    });

    await this.aiService.clearRecordsInCollection(agent.id);
    return parseCvRes;
  }
}
