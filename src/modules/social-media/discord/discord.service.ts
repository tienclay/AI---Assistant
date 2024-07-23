import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

@Injectable()
export class DiscordService {
  onModuleInit() {
    this.chat();
  }
  chat(): string {
    console.log('1 :>> ', 1);
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
        message.reply('hello world!');
      }
    });
    client.login(process.env.TOKEN);

    return 'hello world';
  }
}
