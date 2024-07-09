import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseConfig, configurations } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { GlobalHandleExceptionFilter } from './common/infra-exception';
import { AIModule } from './modules/ai/ai.module';
import { UserModule } from './modules/admin/admin.module';
import { AgentModule } from './modules/agent/agent.module';
import { FileModule } from './modules/file/file.module';
import { CvParserModule } from './modules/cv-parser/cv-parser.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { NamingStrategy } from 'database/typeorm/naming.strategy';
import { AIChatbotModule } from './modules/ai-chatbot/ai.module';

const modules = [
  AuthModule,
  UserModule,
  AIModule,
  AgentModule,
  FileModule,
  CvParserModule,
  AIChatbotModule,
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

    ...modules,

    // ChatbotModule,

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
