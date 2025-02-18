import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';
import { FacebookService } from './facebook/facebook.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordModule } from './discord/discord.module';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://graph.facebook.com/v2.6/me/messages',
    }),
    DiscordModule,
    TelegramModule,
  ],
  providers: [FacebookService],

  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
