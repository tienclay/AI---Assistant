import { ChatbotDiscordModule } from './../../chatbot-discord/chatbot-discord.module';
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
      inject: [DiscordConfig.KEY],
      useFactory: (discordConfig: ConfigType<typeof DiscordConfig>) => {
        const { baseURL, headers } = discordConfig;
        return {
          baseURL,
          headers,
        };
      },
    }),
    TypeOrmModule.forFeature([ChatbotDiscord]),
    forwardRef(() => AIChatbotModule),
    ChannelModule,
    ChatbotDiscordModule,
  ],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
