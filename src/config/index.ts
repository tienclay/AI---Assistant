import DatabaseConfig from './database.config';
import AiDatabaseConfig from './ai-database.config';
import AiServiceConfig from './ai-service.config';
import CacheConfig from './cache.config';
import NovuConfig from './novu.config';
import LogConfig from './log.config';
const configurations = [
  DatabaseConfig,
  AiServiceConfig,
  AiDatabaseConfig,
  CacheConfig,
  NovuConfig,
  LogConfig,
];

export {
  configurations,
  DatabaseConfig,
  AiServiceConfig,
  AiDatabaseConfig,
  CacheConfig,
  NovuConfig,
  LogConfig,
};
