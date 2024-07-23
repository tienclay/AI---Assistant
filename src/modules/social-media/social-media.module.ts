import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';
import { FacebookService } from './facebook/facebook.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordService } from './discord/discord.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://graph.facebook.com/v2.6/me/messages',
    }),
  ],
  providers: [FacebookService],

  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
