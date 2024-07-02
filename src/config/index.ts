import DatabaseConfig from './database.config';
import AiDatabaseConfig from './ai-database.config';
import AiServiceConfig from './ai-service.config';

const configurations = [DatabaseConfig, AiServiceConfig, AiDatabaseConfig];

export { configurations, DatabaseConfig, AiServiceConfig, AiDatabaseConfig };
