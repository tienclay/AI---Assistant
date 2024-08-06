import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelService } from './channel.service';
import { ChanelController } from './channel.controller';

import { Conversation } from '@entities';
import { Channel } from 'database/entities/channel.entity';
// Ensure this path is correct

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Conversation])],
  providers: [ChannelService],
  // controllers: [ChanelController],
  exports: [ChannelService],
})
export class ChannelModule {}
