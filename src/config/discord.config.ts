import { HttpModuleOptions } from '@nestjs/axios';
import { registerAs } from '@nestjs/config';

export default registerAs<HttpModuleOptions>('ai-service', () => ({
  baseURL: process.env.DISCORD_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
  },
}));
