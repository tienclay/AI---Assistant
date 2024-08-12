import { ChatbotDiscordService } from './../../chatbot-discord/chatbot-discord.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { ALL_COMMANDS } from './helps/register-commands';
import { getRandomEmoji, InstallGlobalCommands } from './utils';
import { ChatbotDiscordInfo } from './dtos/info-chatbot.dto';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';
import { Repository } from 'typeorm';
import {
  AIAssistantBadRequestException,
  AIAssistantNotFoundException,
} from 'src/common/infra-exception';

import { ChatbotDiscordToken } from './dtos/input-chatbot-token.dto';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { decrypt, encrypt } from 'src/common/utils/crypto-aes.util';

import { HttpService } from '@nestjs/axios';
import { AIService } from 'src/modules/ai-chatbot/ai.service';

import { ChannelService } from 'src/modules/channel/channel.service';
import { UserDiscord } from 'src/modules/ai-chatbot/interfaces/chat-discord.interface';
import { lastValueFrom } from 'rxjs';
dotenv.config({
  path: '.env',
});

@Injectable()
export class DiscordService {
  constructor(
    @InjectRepository(ChatbotDiscord)
    private readonly chatbotDiscordRepository: Repository<ChatbotDiscord>,
    private readonly httpService: HttpService,
    private readonly aiService: AIService,
    private readonly channelService: ChannelService,
    private readonly chatbotDiscordService: ChatbotDiscordService,
  ) {}

  async sendMessage(channelId: string, content: string, user: UserDiscord) {
    await lastValueFrom(
      this.httpService.post(`/channels/${channelId}/messages`, {
        content: content,
        mentions: [user],
      }),
    );
  }
  async fetchFromDiscord(
    endpoint: string,
    discordToken: string,
    options: RequestInit = {},
  ) {
    const baseURL = process.env.DISCORD_URL;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bot ${discordToken}`,
    };
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    return response.json();
  }

  async sendMessageDiscord(
    channelId: string,
    content: string,
    userId: string,
    discordToken: string,
  ) {
    content = `<@!${userId}>\n` + content;
    await this.fetchFromDiscord(
      `/channels/${channelId}/messages`,
      discordToken,
      {
        method: 'POST',
        body: JSON.stringify({ content: content }),
      },
    );
  }

  createChannel(): void {
    const client = new Client({
      intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
    });
    const PREFIX = 'channel';
    client.on('ready', () => {});

    // const PREFIX = 'channel';
    client.on('ready', () => {
      console.log(`hiii chatbot!`);
    });

    client.on('messageCreate', (message) => {
      // instead of 'message', it's now 'messageCreate'
      if (message.content === 'channel') {
        message.guild.channels.create({ name: 'channel' });
        message.channel.send('Channel Created!');
      }
    });
    client.login(process.env.DISCORD_TOKEN);
  }

  chat(token: string): string {
    const client = new Client({
      intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
    });
    const PREFIX = '/';
    client.on('ready', () => {});

    client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      if (message.content.startsWith(PREFIX)) {
        message.reply('hello world!');

        const content = message.content;
        // message.reply('hello world!');
      }
    });
    // client.login(process.env.DISCORD_TOKEN);
    client.login(token);

    return 'hello world';
  }
  async installCommands(id: string) {
    // const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
    //   where: { id: appId },
    // });
    // if (!chatbotDiscord) {
    //   throw new AIAssistantNotFoundException('Not found chatbot');
    // }
    // const discordToken = decrypt(chatbotDiscord.discordToken);
    const chatbotDiscord = await this.chatbotDiscordRepository.findOneByOrFail({
      id,
    });
    const { appId, discordToken } = chatbotDiscord;
    await InstallGlobalCommands(appId, ALL_COMMANDS, discordToken);
  }
  async updateChatbotInfo(
    chatbotDiscordId: string,
    dto: ChatbotDiscordInfo,
  ): Promise<string> {
    try {
      const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
        where: { id: chatbotDiscordId },
      });
      if (!chatbotDiscord) {
        throw new AIAssistantNotFoundException('Not found chatbot');
      }
      const hashAppId = encrypt(dto.appId);
      const hashDiscordToken = encrypt(dto.discordToken);
      const hashPublicKey = encrypt(dto.publicKey);
      chatbotDiscord.appId = hashAppId;
      chatbotDiscord.discordToken = hashDiscordToken;
      chatbotDiscord.publicKey = hashPublicKey;
      await this.chatbotDiscordRepository.save(chatbotDiscord);
      return 'Update chatbot info successfully';
    } catch (error) {
      throw new AIAssistantBadRequestException(error.message);
    }
  }

  async updateChatbotToken(
    chatbotDiscordId: string,
    dto: ChatbotDiscordToken,
  ): Promise<string> {
    try {
      const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
        where: { id: chatbotDiscordId },
      });
      if (!chatbotDiscord) {
        throw new AIAssistantNotFoundException('Not found chatbot');
      }
      const hashDiscordToken = encrypt(dto.discordToken);
      chatbotDiscord.discordToken = hashDiscordToken;
      await this.chatbotDiscordRepository.save(chatbotDiscord);
      return 'Update chatbot info successfully';
    } catch (error) {
      throw new AIAssistantBadRequestException(error.message);
    }
  }

  // async isRegister
  async interaction(
    type: any,
    data: any,
    message: string,
    channelId: string,
    user: UserDiscord,
    chatbotId: string,
    appId: string,
  ) {
    // Handle discord interactions
    if (type === InteractionType.PING) {
      return { type: InteractionResponseType.PONG };
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // "test" command
      if (name === 'test') {
        // Send a message into the channel where command was triggered from
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: `hello world ${getRandomEmoji()}`,
          },
        };
      } else {
        const chatbotDiscord =
          await this.chatbotDiscordService.getChatbotDiscordByAppId(appId);
        const { discordToken } = chatbotDiscord;
        // send a message into the ai-chanel

        await this.aiService.getAgentCollectionNameAndPromptByChatbotId(
          chatbotId,
        );
        const channel = await this.channelService.getChannelById(channelId);
        let runId;
        if (!channel) {
          const runData =
            await this.aiService.createAgentRunWithoutCreateParticipant(
              chatbotId,
              user.id,
            );
          runId = runData.runId;
          const objectChannel = {
            chatbotId: chatbotId,
            conversationId: runId,
            channelId: channelId,
          };

          await this.channelService.create(objectChannel);
        } else {
          runId = channel.conversationId;
        }

        const dto = {
          message,
          runId,
          userId: user.id,
        };
        // const response = await this.aiService.sendDiscordMessage(dto);

        await this.aiService.sendMessageDiscord(
          chatbotId,
          dto,
          channelId,
          user.id,
          discordToken,
        );

        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: `Your's request is being processed`,
          },
        };
      }

      throw new AIAssistantBadRequestException('unknown command');
    } else {
      throw new AIAssistantBadRequestException('unknown interaction type');
    }
  }
}
