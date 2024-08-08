import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramParticipant } from 'database/entities/telegram-participant.entity';
import { TelegramChatbot } from 'database/entities/telegram-chatbot.entity';
import { AIService } from 'src/modules/ai-chatbot/ai.service';
import { In, Repository } from 'typeorm';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessageEvent, NewMessage } from 'telegram/events';
import {
  AIAssistantBadRequestException,
  Exception,
} from 'src/common/infra-exception';
import {
  StartTelegramChatbotResponseDto,
  StopTelegramChatbotResponseDto,
} from './dtos';

@Injectable()
export class TelegramService {
  private clients: Map<string, TelegramClient> = new Map();
  private logger = new Logger(TelegramService.name);

  constructor(
    @InjectRepository(TelegramChatbot)
    private telegramChatbotRepository: Repository<TelegramChatbot>,

    @InjectRepository(TelegramParticipant)
    private telegramParticipantRepository: Repository<TelegramParticipant>,

    private readonly aiService: AIService,
  ) {}

  async onModuleInit() {
    await this.initTelegramChatbots();
  }

  async getRunningTelegramChatbots(): Promise<TelegramChatbot[]> {
    try {
      const runningTelegramChatbotIds: string[] = Array.from(
        this.clients.keys(),
      );
      const runningTelegramChatbots: TelegramChatbot[] =
        await this.telegramChatbotRepository.find({
          where: {
            telegramChatbotId: In(runningTelegramChatbotIds),
          },
        });

      return runningTelegramChatbots;
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AIAssistantBadRequestException(
        'Error getting running Telegram chatbots',
      );
    }
  }

  async startTelegramChatbot(
    telegramChatbotId: string,
  ): Promise<StartTelegramChatbotResponseDto> {
    try {
      const client: TelegramClient | undefined =
        this.getRunningTelegramChatbotByChatbotId(telegramChatbotId);

      // If the client is already running, throw an error
      if (client) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot already running',
        );
      }

      // Get the Telegram chatbot
      const telegramChatbot: TelegramChatbot =
        await this.telegramChatbotRepository.findOne({
          where: { telegramChatbotId },
          relations: ['account'],
        });

      // Initialize the Telegram chatbot
      await this.initTelegramChatbot(telegramChatbot);

      return {
        message: 'Telegram chatbot started',
      };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AIAssistantBadRequestException(
        'Error starting Telegram chatbot',
      );
    }
  }

  async stopTelegramChatbot(
    telegramChatbotId: string,
  ): Promise<StopTelegramChatbotResponseDto> {
    try {
      const client: TelegramClient | undefined =
        this.getRunningTelegramChatbotByChatbotId(telegramChatbotId);

      // If the client is not running, throw an error
      if (!client) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot not running',
        );
      }

      // Disconnect and destroy the client
      await client.disconnect();
      await client.destroy();

      // Remove the client from the map
      this.clients.delete(telegramChatbotId);

      // Return the response
      return {
        message: 'Telegram chatbot stopped',
      };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AIAssistantBadRequestException(
        'Error stopping Telegram chatbot',
      );
    }
  }

  getRunningTelegramChatbotByChatbotId(
    telegramChatbotId: string,
  ): TelegramClient | undefined {
    return this.clients.get(telegramChatbotId);
  }

  private async getOrCreateRunId(
    telegramUserId: string,
    telegramChatbotId: string,
    telegramChatId: string,
  ): Promise<TelegramParticipant> {
    const telegramChatbot: TelegramChatbot =
      await this.getTelegramChatbotByChatbotId(telegramChatbotId);

    const telegramParticipant: TelegramParticipant =
      await this.telegramParticipantRepository.findOne({
        where: {
          telegramUserId,
          telegramChatbotId: telegramChatbot.id,
        },
      });

    if (telegramParticipant) {
      return telegramParticipant;
    }

    const agentRun = await this.aiService.createAgentRunSocialMedia(
      telegramChatbot.chatbot.id,
      telegramUserId,
    );

    const newParticipant: TelegramParticipant =
      this.telegramParticipantRepository.create({
        telegramChatId,
        telegramChatbotId: telegramChatbot.id,
        telegramUserId,
        runId: agentRun.runId,
      });

    return this.telegramParticipantRepository.save(newParticipant);
  }

  private async getTelegramChatbotByChatbotId(
    telegramChatbotId: string,
  ): Promise<TelegramChatbot> {
    const telegramChatbot: TelegramChatbot | undefined =
      await this.telegramChatbotRepository.findOne({
        where: { telegramChatbotId },
        relations: ['chatbot'],
      });

    if (!telegramChatbot)
      throw new AIAssistantBadRequestException('Telegram chatbot not found');

    return telegramChatbot;
  }

  private async initTelegramChatbot(
    telegramChatbot: TelegramChatbot,
  ): Promise<void> {
    try {
      this.logger.log(
        `Initializing Telegram client for bot ID: ${telegramChatbot.telegramChatbotId}`,
      );

      // Create the Telegram client
      const stringSession: StringSession = new StringSession('');
      const client: TelegramClient = new TelegramClient(
        stringSession,
        Number(telegramChatbot.account.apiId),
        telegramChatbot.account.apiHash,
        {
          connectionRetries: 5,
        },
      );

      this.logger.log(
        `Starting client for bot ID: ${telegramChatbot.telegramChatbotId}`,
      );

      // Start the client and add it to the map
      await client.start({
        botAuthToken: telegramChatbot.token,
      });
      this.clients.set(telegramChatbot.telegramChatbotId, client);

      // Add the event handler for new messages and save the session
      client.addEventHandler(
        this.handleNewMessage.bind(this),
        new NewMessage({}),
      );
      client.session.save();

      this.logger.log(
        `Successfully started client for bot ID: ${telegramChatbot.telegramChatbotId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error initializing client for bot ID: ${telegramChatbot.telegramChatbotId}`,
        error,
      );
    }
  }

  private async initTelegramChatbots(): Promise<void> {
    try {
      const telegramChatbots: TelegramChatbot[] =
        await this.telegramChatbotRepository.find({
          relations: ['account'],
        });

      for (const telegramChatbot of telegramChatbots) {
        await this.initTelegramChatbot(telegramChatbot);
      }
    } catch (error) {
      this.logger.error('Error initializing Telegram clients', error);
    }
  }

  private async handleNewMessage(event: NewMessageEvent): Promise<void> {
    const botUser: Api.User = await event.client.getMe();
    const message: Api.Message = event.message;
    const telegramChatbotId: string = String(botUser.id);
    const fromUserId: string = String(message.senderId);

    // If the message is from the bot itself, return
    if (fromUserId === telegramChatbotId) {
      return;
    }

    const telegramChatbot: TelegramChatbot =
      await this.getTelegramChatbotByChatbotId(telegramChatbotId);

    const telegramChatId = String(message.chatId);
    const telegramUserId = String(message.senderId);
    const messageText = message.text;
    const botParticipant = await this.getOrCreateRunId(
      telegramUserId,
      telegramChatbotId,
      telegramChatId,
    );

    await this.aiService.sendMessageTelegram(
      telegramChatbot.chatbotId,
      telegramUserId,
      telegramChatbotId,
      telegramChatId,
      {
        message: messageText,
        runId: botParticipant.runId,
        userId: botParticipant.telegramUserId,
      },
    );
  }

  async sendTelegramMessageBack(
    client: TelegramClient,
    chatId: string,
    message: string,
  ) {
    client.sendMessage(chatId, { message });
  }
}
