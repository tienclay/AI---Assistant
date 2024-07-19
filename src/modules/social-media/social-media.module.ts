import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';
import { FacebookService } from './facebook/facebook.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FacebookService],
  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
