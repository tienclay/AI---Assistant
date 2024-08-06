import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dtos/create-channel.dto';
import { UpdateChannelDto } from './dtos/update-channel.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('channels')
@ApiTags('Channel')
export class ChanelController {
  constructor(private readonly chanelService: ChannelService) {}

  @Post()
  create(@Body() createChanelDto: CreateChannelDto) {
    return this.chanelService.create(createChanelDto);
  }

  @Get()
  findAll() {
    return this.chanelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chanelService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChanelDto: UpdateChannelDto) {
    return this.chanelService.update(id, updateChanelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chanelService.remove(id);
  }
}
