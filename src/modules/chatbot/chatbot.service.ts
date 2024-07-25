import { Injectable } from '@nestjs/common';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatbot, Knowledge } from '@entities';
import { Repository } from 'typeorm';
import { AIAssistantForbiddenException } from 'src/common/infra-exception';
import { ChatbotKnowledgeDto, UpdateChatbotDto } from './dto';
import { AIService } from '../ai-chatbot/ai.service';
import { CreateAssistantRunResponse } from '../ai-chatbot/dto';
import * as samplePropertyJson from './json/sample-property.json';
import { ChatbotSampleProperty } from './dto/chatbot-response.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
    private readonly aiService: AIService,
  ) {}

  createChatbot(userId: string, dto: CreateChatbotDto): Promise<Chatbot> {
    const chatbotInput = this.chatbotRepository.create({
      ...dto,
      createdById: userId,
    });
    return this.chatbotRepository.save(chatbotInput);
  }

  getAllCompanyChatbot(userId: string): Promise<Chatbot[]> {
    return this.chatbotRepository.find({ where: { createdById: userId } });
  }

  async getChatbotWithUserId(id: string, userId: string): Promise<Chatbot> {
    const chatbot = await this.chatbotRepository
      .createQueryBuilder('chatbot')
      .leftJoinAndMapOne(
        'chatbot.knowledge',
        Knowledge,
        'knowledge',
        'knowledge.chatbot_id = chatbot.id',
      )
      .where('chatbot.id = :chatbotId', { chatbotId: id })
      .getOne();

    if (chatbot.createdById !== userId) {
      throw new AIAssistantForbiddenException(
        'You are not allowed to access this chatbot',
      );
    }
    return chatbot;
  }

  async update(
    id: string,
    userId: string,
    updateChatbotDto: UpdateChatbotDto,
  ): Promise<boolean> {
    // check if user id is owner of this chatbot or not
    await this.getChatbotWithUserId(id, userId);

    const updated = await this.chatbotRepository.update(id, updateChatbotDto);

    if (updated.affected === 0) {
      return false;
    }

    return true;
  }

  async getSampleProperty(): Promise<ChatbotSampleProperty> {
    return samplePropertyJson;
  }

  async loadChatbotKnowledge(
    chatbotId: string,
    userId: string,
    dto: ChatbotKnowledgeDto,
  ) {
    await this.getChatbotWithUserId(chatbotId, userId);
    const curChatbotKnowledge = await this.knowledgeRepository.findOne({
      where: { chatbotId },
    });
    if (curChatbotKnowledge)
      await this.knowledgeRepository.delete(curChatbotKnowledge.id);
    await this.knowledgeRepository.save({
      ...dto,
      chatbotId,
    });

    const chatbotKnowledge = await this.chatbotRepository
      .createQueryBuilder('chatbot')
      .leftJoinAndMapOne(
        'chatbot.knowledge',
        Knowledge,
        'knowledge',
        'knowledge.chatbot_id = chatbot.id',
      )
      .where('chatbot.id = :chatbotId', { chatbotId })
      .getOne();

    return chatbotKnowledge;
  }

  async loadChatbotKnowledgeToAi(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    await this.getChatbotWithUserId(chatbotId, userId);
    const chatbotKnowledge = await this.knowledgeRepository.findOne({
      where: { chatbotId },
    });
    // call AI service to load knowledge
    await this.aiService.loadKnowledge(
      userId,
      chatbotId,
      chatbotKnowledge.websiteUrls || [],
      chatbotKnowledge.pdfUrls || [],
    );

    return this.aiService.createAgentRun(chatbotId, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.chatbotRepository.softDelete({
      id,
      createdById: userId,
    });
  }

  getALlModels(): string[] {
    return [
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3-8B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
      'meta-llama/Meta-Llama-3-70B-Instruct-Lite',
      'zero-one-ai/Yi-34B-Chat',
      'allenai/OLMo-7B-Instruct',
      'allenai/OLMo-7B-Twin-2T',
      'allenai/OLMo-7B',
      'Austism/chronos-hermes-13b',
      'cognitivecomputations/dolphin-2.5-mixtral-8x7b',
      'databricks/dbrx-instruct',
      'deepseek-ai/deepseek-coder-33b-instruct',
      'deepseek-ai/deepseek-llm-67b-chat',
      'garage-bAInd/Platypus2-70B-instruct',
      'google/gemma-2b-it',
      'google/gemma-7b-it',
      'Gryphe/MythoMax-L2-13b',
      'lmsys/vicuna-13b-v1.5',
      'lmsys/vicuna-7b-v1.5',
      'codellama/CodeLlama-13b-Instruct-hf',
      'codellama/CodeLlama-34b-Instruct-hf',
      'codellama/CodeLlama-70b-Instruct-hf',
      'codellama/CodeLlama-7b-Instruct-hf',
      'meta-llama/Llama-2-70b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Llama-3-8b-chat-hf',
      'meta-llama/Llama-3-70b-chat-hf',
      'mistralai/Mistral-7B-Instruct-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mixtral-8x22B-Instruct-v0.1',
      'NousResearch/Nous-Capybara-7B-V1p9',
      'NousResearch/Nous-Hermes-2-Mistral-7B-DPO',
      'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
      'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT',
      'NousResearch/Nous-Hermes-llama-2-7b',
      'NousResearch/Nous-Hermes-Llama2-13b',
      'NousResearch/Nous-Hermes-2-Yi-34B',
      'openchat/openchat-3.5-1210',
      'Open-Orca/Mistral-7B-OpenOrca',
      'Qwen/Qwen1.5-0.5B-Chat',
      'Qwen/Qwen1.5-1.8B-Chat',
      'Qwen/Qwen1.5-4B-Chat',
      'Qwen/Qwen1.5-7B-Chat',
      'Qwen/Qwen1.5-14B-Chat',
      'Qwen/Qwen1.5-32B-Chat',
      'Qwen/Qwen1.5-72B-Chat',
      'Qwen/Qwen1.5-110B-Chat',
      'Qwen/Qwen2-72B-Instruct',
      'snorkelai/Snorkel-Mistral-PairRM-DPO',
      'Snowflake/snowflake-arctic-instruct',
      'togethercomputer/alpaca-7b',
      'teknium/OpenHermes-2-Mistral-7B',
      'teknium/OpenHermes-2p5-Mistral-7B',
      'togethercomputer/Llama-2-7B-32K-Instruct',
      'togethercomputer/RedPajama-INCITE-Chat-3B-v1',
      'togethercomputer/RedPajama-INCITE-7B-Chat',
      'togethercomputer/StripedHyena-Nous-7B',
      'Undi95/ReMM-SLERP-L2-13B',
      'Undi95/Toppy-M-7B',
      'WizardLM/WizardLM-13B-V1.2',
      'upstage/SOLAR-10.7B-Instruct-v1.0',
    ];
  }
}
