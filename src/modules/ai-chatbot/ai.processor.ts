import { Process, Processor } from '@nestjs/bull';
import { AI_QUEUE_JOB, AI_QUEUE_NAME, aiServiceUrl } from './constants';
import { Job } from 'bull';
import {
  AssistantChatInterface,
  CreateAssistantRunInterface,
  LoadKnowledgeInterface,
} from './interfaces';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { MessageService } from '../message/message.service';
import { MessageInputDto } from '../message/dto';
import { MessageSender } from 'src/common/enums';
import { ChatGateway } from '../realtime/chat.gateway';
import { DiscordService } from '../social-media/discord/discord.service';
import { TelegramService } from '../social-media/telegram/telegram.service';
import { extractLastParagraph } from 'src/common/utils/extract-response.util';

@Processor(AI_QUEUE_NAME)
export class AiProcessor {
  constructor(
    private httpService: HttpService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
    private readonly discordService: DiscordService,
    private readonly telegramService: TelegramService,
  ) {}

  @Process(AI_QUEUE_JOB.LOAD_KNOWLEDGE)
  async loadKnowledge(job: Job<LoadKnowledgeInterface>) {
    const loadKnowledgeInput = job.data;
    await lastValueFrom(
      this.httpService.post(aiServiceUrl.loadKnowledge, {
        ...loadKnowledgeInput,
      }),
    );
  }

  @Process(AI_QUEUE_JOB.CREATE_RUN)
  async createRun(job: Job<CreateAssistantRunInterface>) {
    const createAssistantRun = job.data;
    await lastValueFrom(
      this.httpService.post(aiServiceUrl.createAssistantRun, {
        ...createAssistantRun,
      }),
    );
  }

  @Process(AI_QUEUE_JOB.SEND_MESSAGE)
  async sendMessage(job: Job<AssistantChatInterface>) {
    const chatInput = job.data;

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
    await this.chatGateway.sendMessageToClient(chatInput.run_id, res.data);
  }

  @Process(AI_QUEUE_JOB.SEND_MESSAGE_DISCORD)
  async sendMessageDiscord(job: Job<AssistantChatInterface>) {
    const chatInput = job.data;

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
    await this.chatGateway.sendMessageToClient(chatInput.run_id, res.data);
  }

  @Process(AI_QUEUE_JOB.SEND_MESSAGE_TELEGRAM)
  async sendMessageTelegram(job: Job<any>) {
    const chatInput = job.data;

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

    await this.telegramService.sendTelegramMessageBack(
      chatInput.telegramUserId,
      extractLastParagraph(res.data),
    );
  }
}
