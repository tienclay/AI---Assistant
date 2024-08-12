import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiTags } from '@nestjs/swagger';
import { TelegramAccount, TelegramChatbot } from '@entities';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { TelegramInfoDto } from './dtos/telegram-info.dto';
import { TelegramChatbotDto } from './dtos/telegram-chatbot-info.dto';

@Controller('telegram')
@ApiTags('telegram')
export class telegramController {
  constructor(private telegramService: TelegramService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllTelegramAccounts(): Promise<TelegramAccount[]> {
    return await this.telegramService.getAllTelegramAccounts();
  }

  @Post()
  @Roles(UserRole.CLIENT)
  async createTelegramAccount(
    @Body() dto: TelegramInfoDto,
    // @CurrentUser() user: User,
  ): Promise<TelegramAccount> {
    return await this.telegramService.createTelegramAccount(dto);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT)
  async updateTelegramAccount(
    @Body() dto: TelegramInfoDto,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.telegramService.updateTelegramAccount(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  async deleteTelegramAccount(@Param('id') id: string): Promise<boolean> {
    return await this.telegramService.deleteTelegramAccount(id);
  }

  @Get('chatbot')
  @Roles(UserRole.CLIENT)
  async getTelegramChatbot(): Promise<TelegramChatbot[]> {
    return await this.telegramService.getTelegramChatbot();
  }

  @Get('chatbot/:id')
  @Roles(UserRole.CLIENT)
  async getTelegramChatbotById(
    @Param('id') id: string,
  ): Promise<TelegramChatbot> {
    return await this.telegramService.getTelegramChatbotById(id);
  }

  @Post('chatbot')
  @Roles(UserRole.CLIENT)
  async createTelegramChatbot(
    @Body() dto: TelegramChatbotDto,
  ): Promise<TelegramChatbot> {
    return await this.telegramService.createTelegramChatbot(dto);
  }

  @Patch('chatbot/:id')
  @Roles(UserRole.CLIENT)
  async updateTelegramChatbot(
    @Body() dto: TelegramChatbotDto,
    @Param('id') id: string,
  ): Promise<boolean> {
    return await this.telegramService.updateTelegramChatbot(id, dto);
  }

  @Delete('chatbot/:id')
  @Roles(UserRole.CLIENT)
  async deleteTelegramChatbot(@Param('id') id: string): Promise<boolean> {
    return await this.telegramService.deleteTelegramChatbot(id);
  }
}
