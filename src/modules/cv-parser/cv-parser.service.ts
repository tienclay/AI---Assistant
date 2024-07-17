import { Injectable } from '@nestjs/common';
import { AIService } from '../ai-chatbot/ai.service';
import { ParseCvResponseDto } from './dto/cv-parser-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent, Chatbot } from '@entities';
import { extractJSONObject } from 'src/common/utils/extract-json.util';
import { plainToInstance } from 'class-transformer';
import { AIAssistantBadRequestException } from 'src/common/infra-exception';

@Injectable()
export class CvParserService {
  constructor(
    private readonly aiService: AIService,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
  ) {}

  async uploadAndParseCv(url: string): Promise<any> {
    const chatbot = await this.chatbotRepository.findOneByOrFail({
      name: 'CV_Parser',
    });

    await this.aiService.loadKnowledge(
      chatbot.createdById,
      chatbot.id,
      [],
      [url],
    );

    try {
      const agentRun = await this.aiService.createAgentRunForParseCv(
        chatbot.id,
        'parse-cv',
      );

      const message = await this.aiService.sendAiParseCvMessage(chatbot.id, {
        message: 'Parse this Cv into Json for me',
        runId: agentRun.runId,
        userId: agentRun.userId,
      });

      const parseCvRes = plainToInstance(ParseCvResponseDto, message.data);

      await this.aiService.clearRecordsInCollection(chatbot.id);
      return parseCvRes;
    } catch (error) {
      throw new AIAssistantBadRequestException(error.message);
    }
  }
}
