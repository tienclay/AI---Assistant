import { HttpModuleOptions } from '@nestjs/axios';
import { registerAs } from '@nestjs/config';

export default registerAs<HttpModuleOptions>('discord-service', () => ({
  baseURL: process.env.DISCORD_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
  },
}));
