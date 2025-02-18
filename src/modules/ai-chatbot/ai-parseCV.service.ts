import { Chatbot, Participant } from '@entities';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { aiServiceUrl } from './constants';
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
import { v4 as uuidv4 } from 'uuid';
import { extractJSONObject } from 'src/common/utils/extract-json.util';

@Injectable()
export class AIParseCVService {
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
      assistant: AiAssistantType.RAG_PDF,
      agent_collection_name: chatbotInfo.collectionName,
      website_urls: websiteUrls,
      pdf_urls: pdfUrls,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
    };

    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        ...loadKnowledgeInput,
      }),
    );

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

    const conversation: CreateConversationDto = {
      id: res.data.run_id,
      chatbotId,
      title: `Chat with ${chatbotInfo.collectionName}`,
      participantId: userId,
    };
    await this.conversationService.create(conversation);

    const paricipant: ParticipantInputDto = {
      id: userId == 'parse-cv' ? uuidv4() : userId,
      name: userId,
    };

    const newPaticipant = await this.participantRepository.create(paricipant);

    await this.participantRepository.save(newPaticipant);

    return plainToInstance(CreateAssistantRunResponse, {
      runId: res.data.run_id,
      userId: res.data.user_id,
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
  async sendMessage(
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
      assistant: AiAssistantType.RAG_PDF,
      property: {
        prompt: chatbotInfo.prompt,
        instructions: chatbotInfo.persona,
        extra_instructions: [],
      },
      model: chatbotInfo.model,
    };

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );
    const message: MessageInputDto = {
      content: res.data,
      conversationId: dto.runId,
      messageSender: MessageSender.BOT,
      participantId: null,
    };
    await this.messageService.createMessage(message);

    return plainToInstance(AssistantChatResponse, { data: res.data });
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
      assistant: AiAssistantType.RAG_PDF,
      property: {
        // prompt: chatbotInfo.prompt,
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
  workExperiences: [
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
  educations: [
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
      level: enum, [BASIC, CONVERSATIONAL, WORKING_PROFICIENCY, FLUENT, NATIVE_BILINGUAL]
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
    const isString = typeof res.data === 'string';
    if (isString) {
      return plainToInstance(AssistantChatResponse, {
        data: extractJSONObject(res.data),
      });
    }
    return plainToInstance(AssistantChatResponse, {
      data: res.data,
    });
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
      assistant: AiAssistantType.RAG_PDF,
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

  private async getAgentCollectionNameAndPromptByChatbotId(
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
      persona: chatbot.persona,
      description: chatbot.description,
      instruction: chatbot.instruction,
      model: chatbot.model,
    };
  }
}
