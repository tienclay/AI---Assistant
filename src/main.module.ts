import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  BullConfig,
  DatabaseConfig,
  LogConfig,
  configurations,
} from './config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { GlobalHandleExceptionFilter } from './common/infra-exception';
import { FileModule } from './modules/file/file.module';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { OtpCacheModule } from './modules/otp-cache/otp-cache.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthEmailModule } from './modules/auth/auth-email/auth-email.module';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { MessageModule } from './modules/message/message.module';
import { SocialMediaModule } from './modules/social-media/social-media.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { BullModule } from '@nestjs/bull';
import * as dotenv from 'dotenv';
import { ChannelModule } from './modules/channel/channel.module';
import { ChatbotDiscordModule } from './modules/chatbot-discord/chatbot-discord.module';
import { VerifyKeyMiddleware } from './common/middlewares/verify-key.middleware';
import { ScheduleJobModule } from './modules/schedule-job/schedule-job.module';
dotenv.config({
  path: '.env',
});

const modules = [
  AuthModule,
  FileModule,
  CvParserModule,
  ConversationModule,
  ChatbotModule,
  OtpCacheModule,
  AuthEmailModule,
  ChatbotModule,
  SocialMediaModule,
  RealtimeModule,
  ScheduleJobModule,
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

    BullModule.forRootAsync({
      inject: [BullConfig.KEY],
      useFactory: (config: ConfigType<typeof BullConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without bull config');
        }
        return {
          redis: config.redis,
        };
      },
    }),

    ...modules,

    MessageModule,

    ChannelModule,

    ChatbotDiscordModule,

    // ConversationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHandleExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyKeyMiddleware).forRoutes({
      path: 'social-media/discord/:chatbotId/interactions',
      method: RequestMethod.POST,
    });
  }
}
// export class AppModule {}
