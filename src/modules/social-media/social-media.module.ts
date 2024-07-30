import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';
import { FacebookService } from './facebook/facebook.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordService } from './discord/discord.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotDiscord } from 'database/entities/chatbot.discord.entity';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://graph.facebook.com/v2.6/me/messages',
    }),
    TypeOrmModule.forFeature([ChatbotDiscord]),
  ],
  providers: [FacebookService, DiscordService],

  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
