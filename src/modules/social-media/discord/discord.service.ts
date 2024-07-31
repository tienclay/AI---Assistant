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
import { encrypt } from 'src/common/utils/crypto-aes.util';

import { HttpService } from '@nestjs/axios';
import { AIService } from 'src/modules/ai-chatbot/ai.service';
import { plainToInstance } from 'class-transformer';
import { ChannelService } from 'src/modules/channel/channel.service';
import { CreateChannelDto } from 'src/modules/channel/dtos/create-channel.dto';
import { AssistantChatInterface } from 'src/modules/ai-chatbot/interfaces';
import { AiAssistantType } from 'src/common/enums';
import { AiProcessor } from 'src/modules/ai-chatbot/ai.processor';

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
  ) {}

  sendMessage(channelId: string, refMessage: string, content: string) {
    this.httpService.post(`/channels/${channelId}/messages`, {
      content: content,
      message_reference: {
        message_id: refMessage,
      },
    });
  }

  createChannel(): void {
    const client = new Client({
      intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
    });
    const PREFIX = 'channel';
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
    client.on('ready', () => {
      console.log(`hiii chatbot!`);
    });

    client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      if (message.content.startsWith(PREFIX)) {
        message.reply('hello world!');
        const content = message.content;
        console.log(message.content);
        // message.reply('hello world!');
      }
    });
    // client.login(process.env.DISCORD_TOKEN);
    client.login(token);

    return 'hello world';
  }
  async installCommands(appId: string) {
    // const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
    //   where: { id: appId },
    // });
    // if (!chatbotDiscord) {
    //   throw new AIAssistantNotFoundException('Not found chatbot');
    // }
    // const discordToken = decrypt(chatbotDiscord.discordToken);
    const discordToken = process.env.DISCORD_TOKEN;
    await InstallGlobalCommands(appId, ALL_COMMANDS, discordToken);
  }
  async updateChatbotInfo(
    chatbotId: string,
    dto: ChatbotDiscordInfo,
  ): Promise<string> {
    try {
      const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
        where: { id: chatbotId },
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
    chatbotId: string,
    dto: ChatbotDiscordToken,
  ): Promise<string> {
    try {
      const chatbotDiscord = await this.chatbotDiscordRepository.findOne({
        where: { id: chatbotId },
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
    userId: string,
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
        // send a message into the ai-chanel
        const chatbotId = process.env.CODELIGHT_ID;
        const chatbotInfo =
          await this.aiService.getAgentCollectionNameAndPromptByChatbotId(
            chatbotId,
          );
        const channel = await this.channelService.getChannelById(channelId);
        let runId;
        if (!channel) {
          const runData = await this.aiService.createAgentRunDiscord(
            chatbotId,
            userId,
          );
          runId = runData.runId;
          const objectChannel = {
            chatbotId: chatbotId,
            conversationId: runId,
            channelId: channelId,
          };
          console.log('objectChannel :>> ', objectChannel);
          await this.channelService.create(objectChannel);
        } else {
          runId = channel.conversationId;
        }
        const dataInput: AssistantChatInterface = {
          message: message,
          stream: true,
          run_id: runId,
          user_id: userId,
          agent_collection_name: chatbotInfo.collectionName,
          assistant: AiAssistantType.AUTO_PDF,
          property: {
            prompt: chatbotInfo.prompt,
            instructions: chatbotInfo.instruction,
            extra_instructions: chatbotInfo.persona,
          },
          model: chatbotInfo.model,
        };
        const response = await this.aiService.sendDiscordMessage(dataInput);
        console.log(response);
        console.log('typeof response :>> ', typeof response);

        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: response.toString(),
          },
        };
      }
      console.error(`unknown command: ${name}`);

      throw new AIAssistantBadRequestException('unknown command');
    } else {
      throw new AIAssistantBadRequestException('unknown interaction type');
    }
  }
}
