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
import { ConversationService } from '../conversation/conversation.service';
import { MessageService } from '../message/message.service';
import { MessageInputDto } from '../message/dto';
import { MessageSender } from 'src/common/enums';
import { ChatGateway } from '../realtime/chat.gateway';
import { DiscordService } from '../social-media/discord/discord.service';
import { TelegramService } from '../social-media/telegram/telegram.service';

import { removePatternFromResponse } from 'src/common/utils/extract-response.util';
import { AssistantChatDiscordInterface } from './interfaces/chat-discord.interface';
import { TelegramManageChatbotService } from '../social-media/telegram/services/telegram-manage-chatbot.service';

@Processor(AI_QUEUE_NAME)
export class AiProcessor {
  constructor(
    private httpService: HttpService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
    private readonly discordService: DiscordService,
    private readonly telegramService: TelegramService,
    private readonly telegramManageChatbotService: TelegramManageChatbotService,
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
  async sendMessageDiscord(job: Job<AssistantChatDiscordInterface>) {
    const { chatInput, channelId, userId, messageRequest, discordToken } =
      job.data;

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );
    const content = removePatternFromResponse(res.data);
    const message: MessageInputDto = {
      content,
      conversationId: chatInput.run_id,
      messageSender: MessageSender.BOT,
      participantId: null,
    };
    const response = `Qusetion: ${messageRequest}\nAnswer: ${content}`;
    await this.messageService.createMessage(message);
    await this.discordService.sendMessageDiscord(
      channelId,
      response,
      userId,
      discordToken,
    );
  }

  @Process(AI_QUEUE_JOB.SEND_MESSAGE_TELEGRAM)
  async sendMessageTelegram(job: Job<any>) {
    const { chatInput, telegramBotId, telegramChatId } = job.data;

    const res = await lastValueFrom(
      this.httpService.post(aiServiceUrl.sendMessage, {
        ...chatInput,
      }),
    );

    // const message: MessageInputDto = {
    //   content: res.data,
    //   conversationId: chatInput.run_id,
    //   messageSender: MessageSender.BOT,
    //   participantId: null,
    // };

    // await this.messageService.createMessage(message);

    const bot = this.telegramManageChatbotService.clients.get(telegramBotId);
    await this.telegramService.sendTelegramMessageBack(
      bot,
      telegramChatId,
      removePatternFromResponse(res.data),
    );
  }
}
