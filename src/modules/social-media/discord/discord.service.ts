import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { HttpService } from '@nestjs/axios';
dotenv.config({
  path: '.env',
});

@Injectable()
export class DiscordService {
  constructor(private readonly httpService: HttpService) {}

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
        const content = message.content;
        console.log(message.content);
        // message.reply('hello world!');
      }
    });
    // client.login(process.env.DISCORD_TOKEN);
    client.login(token);

    return 'hello world';
  }
}
