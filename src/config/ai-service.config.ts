import { HttpModuleOptions } from '@nestjs/axios';
import { registerAs } from '@nestjs/config';

export default registerAs<HttpModuleOptions>('ai-service', () => ({
  baseURL: process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}));
