import { Module } from '@nestjs/common';
import { SocialMediaController } from './social-media.controller';

@Module({
  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
