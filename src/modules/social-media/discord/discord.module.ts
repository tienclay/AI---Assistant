import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AiServiceConfig, DiscordConfig } from 'src/config';
import { DiscordService } from './discord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';
import { AIChatbotModule } from 'src/modules/ai-chatbot/ai.module';
import { ChannelModule } from 'src/modules/channel/channel.module';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([ChatbotDiscord]),
    forwardRef(() => AIChatbotModule),
    ChannelModule,
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
