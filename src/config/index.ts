import DatabaseConfig from './database.config';
import AiDatabaseConfig from './ai-database.config';
import AiServiceConfig from './ai-service.config';
import CacheConfig from './cache.config';
import NovuConfig from './novu.config';
import LogConfig from './log.config';
import BullConfig from './bull.config';
import DiscordConfig from './discord.config';

const configurations = [
  DatabaseConfig,
  AiServiceConfig,
  AiDatabaseConfig,
  CacheConfig,
  NovuConfig,
  LogConfig,
  BullConfig,
  DiscordConfig,
];

export {
  configurations,
  DatabaseConfig,
  AiServiceConfig,
  AiDatabaseConfig,
  CacheConfig,
  NovuConfig,
  LogConfig,
  BullConfig,
  DiscordConfig,
};
