import { Injectable } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { ParseCvResponseDto } from './dto/cv-parser-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '@entities';
import { extractJSONObject } from 'src/common/utils/extract-json.util';
import { plainToInstance } from 'class-transformer';
import { AIAssistantBadRequestException } from 'src/common/infra-exception';

@Injectable()
export class CvParserService {
  constructor(
    private readonly aiService: AIService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async uploadAndParseCv(url: string): Promise<any> {
    const agent = await this.agentRepository.findOneByOrFail({
      companyName: 'CV_Parser',
    });

    await this.aiService.loadKnowledge(agent.userId, agent.id, [], [url]);

    try {
      const agentRun = await this.aiService.createAgentRun(
        agent.id,
        'parse-cv',
      );

      const message = await this.aiService.sendMessage(agent.id, {
        message: 'Parse this Cv into Json for me',
        runId: agentRun.runId,
        userId: agentRun.userId,
      });

      const jsonObj = extractJSONObject(message.data);

      const skills = jsonObj['skills'];

      const parseCvRes = plainToInstance(ParseCvResponseDto, {
        ...jsonObj['personalInformation'],
        workExperiences:
          // jsonObj['WorkExperience'] ||
          jsonObj['workExperience'],
        // jsonObj['work_experience'],
        educations: jsonObj['education'],
        skills: (Array.isArray(skills)
          ? skills
          : skills.replace(', ', ',').split(',')
        ).map((skill) => skill.trim()),
        languages: jsonObj['languages'],
      });

      await this.aiService.clearRecordsInCollection(agent.id);
      return parseCvRes;
    } catch (error) {
      throw new AIAssistantBadRequestException(error.message);
    }
  }
}
