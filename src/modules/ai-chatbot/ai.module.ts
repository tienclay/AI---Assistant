import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiDatabaseConfig, AiServiceConfig } from 'src/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Agent, Chatbot } from '@entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, Chatbot]),
    TypeOrmModule.forRootAsync({
      name: 'cv-parser', // 'cv-parser' is the name of the database connection in the config file 'ai-database.config.ts
      inject: [AiDatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof AiDatabaseConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config as TypeOrmModuleOptions;
      },
    }),
    HttpModule.registerAsync({
      inject: [AiServiceConfig.KEY],
      useFactory: (aiServiceConfig: ConfigType<typeof AiServiceConfig>) => {
        const { baseURL, headers } = aiServiceConfig;
        return {
          baseURL,
          headers,
        };
      },
    }),
  ],

  providers: [AIService],
  // controllers: [AIController],
  exports: [AIService],
})
export class AIChatbotModule {}
