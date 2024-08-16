import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramChatbot } from 'database/entities/telegram-chatbot.entity';
import { Repository } from 'typeorm';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import {
  AIAssistantBadRequestException,
  Exception,
} from 'src/common/infra-exception';
import {
  StartTelegramChatbotResponseDto,
  StopTelegramChatbotResponseDto,
} from '../dtos';
import { TelegramChatbotStatus } from 'src/common/enums';
import { AIService } from 'src/modules/ai-chatbot/ai.service';
import { TelegramParticipant } from '@entities';

@Injectable()
export class TelegramManageChatbotService implements OnModuleInit {
  // Map <telegramChatbotId, TelegramClient>: This is used to store the Telegram clients for each chatbot
  private clients: Map<string, TelegramClient> = new Map();
  private logger = new Logger(TelegramManageChatbotService.name);

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

  async startTelegramChatbot(
    telegramChatbotId: string,
  ): Promise<StartTelegramChatbotResponseDto> {
    try {
      const client: TelegramClient | undefined =
        this.clients.get(telegramChatbotId);

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

      if (!telegramChatbot) {
        throw new AIAssistantBadRequestException('Telegram chatbot not found');
      }

      // Initialize the Telegram chatbot
      await this.initTelegramChatbot(telegramChatbot);

      // Update the Telegram chatbot status
      await this.telegramChatbotRepository.update(telegramChatbot.id, {
        status: TelegramChatbotStatus.ACTIVE,
      });

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
        this.clients.get(telegramChatbotId);

      // If the client is not running, throw an error
      if (!client) {
        throw new AIAssistantBadRequestException(
          'Telegram chatbot not running or not found',
        );
      }

      // Disconnect and destroy the client
      await client.disconnect();
      await client.destroy();

      // Remove the client from the map
      this.clients.delete(telegramChatbotId);

      // Get the Telegram chatbot
      const telegramChatbot: TelegramChatbot =
        await this.telegramChatbotRepository.findOne({
          where: { telegramChatbotId },
        });

      // Update the Telegram chatbot status
      await this.telegramChatbotRepository.update(telegramChatbot.id, {
        status: TelegramChatbotStatus.INACTIVE,
      });

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

  async sendTelegramMessageBack(
    client: TelegramClient,
    chatId: string,
    message: string,
  ) {
    client.sendMessage(chatId, { message });
  }

  private async initTelegramChatbot(
    telegramChatbot: TelegramChatbot,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Initializing Telegram client for bot ID: ${telegramChatbot.telegramChatbotId}`,
      );

      let stringSession: StringSession = new StringSession('');
      const isStringSessionValid: boolean =
        telegramChatbot?.stringSession &&
        typeof telegramChatbot.stringSession === 'string' &&
        telegramChatbot.stringSession.trim() !== '';

      if (isStringSessionValid) {
        try {
          stringSession = new StringSession(telegramChatbot.stringSession);
        } catch (error) {
          this.logger.error(
            `Invalid string session for bot ID: ${telegramChatbot.telegramChatbotId}. Creating a new one.`,
          );

          stringSession = new StringSession('');
        }
      }

      // Create the Telegram client
      const client: TelegramClient = new TelegramClient(
        stringSession,
        Number(telegramChatbot.account.apiId),
        telegramChatbot.account.apiHash,
        {
          connectionRetries: 5,
        },
      );

      this.logger.debug(
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

      // Save the session for not having to login again
      const telegramStringSession: string = client.session.save() as any;
      await this.telegramChatbotRepository.update(telegramChatbot.id, {
        stringSession: telegramStringSession,
      });

      this.logger.debug(
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
      await this.telegramChatbotRepository.findOne({
        where: { telegramChatbotId },
        relations: ['account'],
      });

    const telegramChatId = String(message.chatId);
    const sender = message._sender['firstName'];
    const channelId = String(message.peerId['channelId']);

    const telegramUserId = String(message.senderId);
    const messageText = `Name sender: ${sender}\nMessage: ${message.text}`;

    const botParticipant = await this.getOrCreateRunId(
      channelId,
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

  private async getOrCreateRunId(
    telegramUserId: string,
    telegramChatbotId: string,
    telegramChatId: string,
  ): Promise<TelegramParticipant> {
    const telegramChatbot: TelegramChatbot =
      await this.telegramChatbotRepository.findOne({
        where: { telegramChatbotId },
        relations: ['chatbot'],
      });

    const telegramParticipant: TelegramParticipant =
      await this.telegramParticipantRepository.findOne({
        where: {
          telegramChatId,
          telegramChatbotId: telegramChatbot.id,
        },
      });

    if (telegramParticipant) {
      return telegramParticipant;
    }

    const agentRun = await this.aiService.createAgentRunSocialMedia(
      telegramChatbot.chatbot.id,
      telegramChatId,
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
}
