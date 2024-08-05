import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'database/entities/channel.entity';

import { Repository } from 'typeorm';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { ReponseChannelDto } from './dtos/reponse-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelRepository.create(createChannelDto);
    return await this.channelRepository.save(channel);
  }

  async getChannelById(channelId: string): Promise<ReponseChannelDto> {
    const channel = await this.channelRepository.findOneBy({ channelId });
    return channel;
  }

  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find();
  }

  async findOne(id: string): Promise<Channel> {
    const channel = await this.channelRepository.findOneBy({ id });
    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
    return channel;
  }

  async update(
    id: string,
    updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOneBy({ id });
    Object.assign(channel, updateChannelDto);
    return await this.channelRepository.save(channel);
  }

  async remove(id: string): Promise<void> {
    const channel = await this.channelRepository.findOneBy({ id });
    await this.channelRepository.remove(channel);
  }
}
