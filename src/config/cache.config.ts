import { CacheModuleOptions } from '@nestjs/cache-manager';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

export default registerAs<CacheModuleOptions>('cache', () => ({
  store: 'redis',
  host: process.env.REDIS_HOST,
  isGlobal: true,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  ttl: parseInt(process.env.REDIS_TTL || '300', 10),
}));
