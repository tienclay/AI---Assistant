import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseConfig, LogConfig, configurations } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { GlobalHandleExceptionFilter } from './common/infra-exception';
import { AIModule } from './modules/ai/ai.module';

import { AgentModule } from './modules/agent/agent.module';
import { FileModule } from './modules/file/file.module';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ConversationModule } from './modules/conversation/conversation.module';

import { AIChatbotModule } from './modules/ai-chatbot/ai.module';
import { OtpCacheModule } from './modules/otp-cache/otp-cache.module';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AuthEmailModule } from './modules/auth/auth-email/auth-email.module';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { MessageModule } from './modules/message/message.module';
import { SocialMediaModule } from './modules/social-media/social-media.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

const modules = [
  AuthModule,
  AIModule,
  AgentModule,
  FileModule,
  CvParserModule,
  AIChatbotModule,
  ConversationModule,
  ChatbotModule,
  OtpCacheModule,
  AuthEmailModule,
  ChatbotModule,
  SocialMediaModule,
  RealtimeModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
      cache: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof DatabaseConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config as TypeOrmModuleOptions;
      },
    }),
    WinstonModule.forRootAsync({
      inject: [LogConfig.KEY],
      useFactory: (config: ConfigType<typeof LogConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without winston config');
        }
        return config as WinstonModuleOptions;
      },
    }),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),

    ...modules,

    MessageModule,

    // ConversationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHandleExceptionFilter,
    },
  ],
})
export class AppModule {}
