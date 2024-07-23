import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';
import { FacebookService } from './facebook/facebook.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordService } from './discord/discord.service';

@Module({
  imports: [HttpModule],
  providers: [FacebookService, DiscordService],
  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
