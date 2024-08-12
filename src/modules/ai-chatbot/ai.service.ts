import { Chatbot, Participant } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { AI_QUEUE_JOB, AI_QUEUE_NAME, aiServiceUrl } from './constants';
import {
  chatbotInfo,
  AssistantChatInterface,
  CreateAssistantRunInterface,
  LoadKnowledgeInterface,
} from './interfaces';
import { AiAssistantType, MessageSender } from 'src/common/enums';
import { plainToInstance } from 'class-transformer';
import {
  AssistantChatDto,
  AssistantChatResponse,
  CreateAssistantRunResponse,
} from './dto';
import { AssistantHistoryDto } from './dto/history.dto';
import { AgentHistory } from './interfaces/history.interface';
import { ConversationService } from '../conversation/conversation.service';
import { CreateConversationDto } from '../conversation/dto/create-conversation.dto';
import { MessageService } from '../message/message.service';
import { MessageInputDto } from '../message/dto';
import { ParticipantInputDto } from './dto/paticipant.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as samplePropertyJson from './json/sample-property.json';
import * as allSupportedModels from './json/all-model-support.json';
import { ChatbotSampleProperty } from './dto/chatbot-response.dto';

import { AssistantChatDiscordInterface } from './interfaces/chat-discord.interface';

@Injectable()
export class AIService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Chatbot)
    private readonly chatbotRepository: Repository<Chatbot>,
    @InjectDataSource('cv-parser')
    private readonly dataSource: DataSource,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectQueue(AI_QUEUE_NAME)
    private readonly aiQueue: Queue,
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

  async getSampleProperty(): Promise<ChatbotSampleProperty> {
    return samplePropertyJson;
  }

  async loadKnowledge(
    clientId: string,
    chatbotId: string,
    websiteUrls?: string[],
    pdfUrls?: string[],
  ): Promise<boolean> {
    await this.chatbotRepository.findOneByOrFail({
      id: chatbotId,
      createdById: clientId,
    });

    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const loadKnowledgeInput: LoadKnowledgeInterface = {
      assistant: AiAssistantType.AUTO_PDF,
      agent_collection_name: chatbotInfo.collectionName,
      website_urls: websiteUrls,
      pdf_urls: pdfUrls,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };
    // send request to processor
    await this.aiQueue.add(AI_QUEUE_JOB.LOAD_KNOWLEDGE, loadKnowledgeInput);

    return true;
  }

  async createAgentRun(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.createAssistantRun, {
        ...createAssistantRun,
      }),
    );

    const conversation: CreateConversationDto = {
      id: res.data.run_id,
      chatbotId,
      title: `Chat with ${chatbotInfo.collectionName}`,
      participantId: userId,
    };

    await this.conversationService.create(conversation);

    const paricipant: ParticipantInputDto = {
      id: userId,
      name: userId,
    };

    const newPaticipant = await this.participantRepository.create(paricipant);

    await this.participantRepository.save(newPaticipant);

    return plainToInstance(CreateAssistantRunResponse, {
      runId: res.data.run_id,
      userId: res.data.user_id,
      conversationId: res.data.run_id,
      chatHistory: res.data.chat_history,
    });
  }

  async createAgentRunWithoutCreateParticipant(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.createAssistantRun, {
        ...createAssistantRun,
      }),
    );

    const conversation: CreateConversationDto = {
      id: res.data.run_id,
      chatbotId,
      title: `Chat with ${chatbotInfo.collectionName}`,
      participantId: userId,
    };

    await this.conversationService.create(conversation);

    return plainToInstance(CreateAssistantRunResponse, {
      runId: res.data.run_id,
      userId: res.data.user_id,
      conversationId: res.data.run_id,
      chatHistory: res.data.chat_history,
    });
  }

  async createAgentRunSocialMedia(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.createAssistantRun, {
        ...createAssistantRun,
      }),
    );

    const conversation: CreateConversationDto = {
      id: res.data.run_id,
      chatbotId,
      title: `Chat with ${chatbotInfo.collectionName}`,
      participantId: userId,
    };

    await this.conversationService.create(conversation);

    return plainToInstance(CreateAssistantRunResponse, {
      runId: res.data.run_id,
      userId: res.data.user_id,
      conversationId: res.data.run_id,
      chatHistory: res.data.chat_history,
    });
  }

  async createAgentRunForParseCv(
    chatbotId: string,
    userId: string,
  ): Promise<CreateAssistantRunResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const createAssistantRun: CreateAssistantRunInterface = {
      user_id: userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.RAG_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
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

  async sendMessage(chatbotId: string, dto: AssistantChatDto): Promise<any> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.instruction,
        description: chatbotInfo.description,
        extra_instructions: chatbotInfo.persona,
      },
      model: chatbotInfo.model,
    };

    await this.aiQueue.add(AI_QUEUE_JOB.SEND_MESSAGE, chatInput);
  }
  async sendDirectMessage(
    chatbotId: string,
    dto: AssistantChatDto,
  ): Promise<any> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);
    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.instruction,
        description: chatbotInfo.description,
        extra_instructions: chatbotInfo.persona,
      },
      model: chatbotInfo.model,
    };

    await this.aiQueue.add(AI_QUEUE_JOB.SEND_MESSAGE_TELEGRAM, {
      ...chatInput,
    });

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    const message: MessageInputDto = {
      content: res.data,
      conversationId: chatInput.run_id,
      messageSender: MessageSender.BOT,
      participantId: null,
    };
    await this.messageService.createMessage(message);

    return this.removePatternFromResponse(res.data);
  }

  async sendMessageTelegram(
    chatbotId: string,
    telegramUserId: string,
    telegramBotId: string,
    telegramChatId: string,
    dto: AssistantChatDto,
  ): Promise<any> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.instruction,
        description: chatbotInfo.description,
        extra_instructions: chatbotInfo.persona,
      },
      model: chatbotInfo.model,
    };

    await this.aiQueue.add(AI_QUEUE_JOB.SEND_MESSAGE_TELEGRAM, {
      chatInput,
      telegramChatId,
      telegramUserId,
      telegramBotId,
    });

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    const message: MessageInputDto = {
      content: res.data,
      conversationId: chatInput.run_id,
      messageSender: MessageSender.BOT,
      participantId: null,
    };
    await this.messageService.createMessage(message);

    return this.removePatternFromResponse(res.data);
  }

  async sendMessageDiscord(
    chatbotId: string,
    dto: AssistantChatDto,
    channelId: string,
    userId: string,
    discordToken: string,
  ): Promise<any> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.instruction,
        description: chatbotInfo.description,
        extra_instructions: chatbotInfo.persona,
      },
      model: chatbotInfo.model,
    };

    const discordInput: AssistantChatDiscordInterface = {
      chatInput,
      channelId,
      userId,
      messageRequest: dto.message,
      discordToken,
    };

    await this.aiQueue.add(AI_QUEUE_JOB.SEND_MESSAGE_DISCORD, discordInput);
  }

  async sendAiParseCvMessage(
    chatbotId: string,
    dto: AssistantChatDto,
  ): Promise<AssistantChatResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AssistantChatInterface = {
      message: dto.message,
      stream: true,
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: [],
        extra_instructions: [],
        expected_output: `
        {
          firstName: string,
          lastName: string,
          gender: string,
          dateOfBirth: string,
          email: string,
          phoneCode: string,
          phone: string,
          title: string,
          summary: string,
          totalExperience: string,
          location: string,
          workExperience: [
              {
                companyName: string,
                position: string,
                fromMonth: number,
                fromYear: number,
                toMonth: number | null,
                toYear: number | null,
                description: string,
              }
          ];
          education: [
              {
               institutionName: string,
               degree: string,
               fromMonth: number | null,
               fromYear: number,
               toMonth: number | null,
               toYear: number,
          }
          ]
          skills: string[];
          languages: [
              label: string
              level: string, [BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL]
          ];
        }
        `,
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $defs, ...remain } = res.data;

    return plainToInstance(AssistantChatResponse, { data: remain });
  }

  async sendHistory(
    chatbotId: string,
    dto: AssistantHistoryDto,
  ): Promise<AssistantChatResponse> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    const chatInput: AgentHistory = {
      run_id: dto.runId,
      user_id: dto.userId,
      agent_collection_name: chatbotInfo.collectionName,
      assistant: AiAssistantType.AUTO_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.getAgentHistory, {
        ...chatInput,
      }),
    );

    // save res.data to a json file

    return plainToInstance(AssistantChatResponse, { data: res.data });
  }

  async clearRecordsInCollection(chatbotId: string): Promise<boolean> {
    const chatbotInfo =
      await this.getAgentCollectionNameAndPromptByChatbotId(chatbotId);

    await this.dataSource.query(
      `DELETE FROM ai."${chatbotInfo.collectionName}"`,
    );

    return true;
  }

  async getAgentCollectionNameAndPromptByChatbotId(
    chatbotId: string,
  ): Promise<chatbotInfo> {
    const chatbot = await this.chatbotRepository.findOneOrFail({
      where: {
        id: chatbotId,
      },
    });

    return {
      collectionName: `${chatbot.name}:${chatbot.id}`,
      prompt: chatbot.prompt,
      description: chatbot.description,
      persona: chatbot.persona,
      instruction: chatbot.instruction,
      model: chatbot.model,
    };
  }
  removePatternFromResponse(response: string): string {
    // Regular expression to match the pattern " - Running: {dynamic part}\n\n"
    const pattern = /\n - Running: .*\n\n/;

    // Check if the pattern exists in the response
    if (pattern.test(response)) {
      // Remove the pattern from the response
      response = response.replace(pattern, '');
    }

    return response;
  }

  async sendDiscordMessage(message: AssistantChatInterface) {
    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...message,
      }),
    );

    return this.removePatternFromResponse(res.data);
  }

  getAllModels(): string[] {
    return allSupportedModels;
  }
}
