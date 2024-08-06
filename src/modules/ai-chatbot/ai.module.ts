import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiDatabaseConfig, AiServiceConfig } from 'src/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Agent, Chatbot, Participant } from '@entities';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { AIParseCVService } from './ai-parseCV.service';

import { BullModule } from '@nestjs/bull';
import { AI_QUEUE_NAME } from './constants';
import { AiProcessor } from './ai.processor';
import { RealtimeModule } from '../realtime/realtime.module';
import { DiscordModule } from '../social-media/discord/discord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, Chatbot, Participant]),
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

    ConversationModule,
    MessageModule,
    BullModule.registerQueue({
      name: AI_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
      },
    }),
    forwardRef(() => RealtimeModule),
    DiscordModule,
  ],

  providers: [AIService, AIParseCVService, AiProcessor],
  // controllers: [AIController],
  exports: [AIService, AIParseCVService],
})
export class AIChatbotModule {}
