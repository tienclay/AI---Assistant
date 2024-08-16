import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TelegramAccount, TelegramChatbot, User } from '@entities';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { TelegramInfoDto } from './dtos/telegram-info.dto';
import { TelegramChatbotDto } from './dtos/telegram-chatbot-info.dto';
import { AuthGuard, RolesGuard } from 'src/modules/auth/guard';
import {
  StartTelegramChatbotResponseDto,
  StopTelegramChatbotResponseDto,
} from './dtos';
import { TelegramServiceV2 } from './v2.telegram.service';

@Controller('telegram')
@ApiTags('Telegram')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private telegramServiceV2: TelegramServiceV2,
  ) {}

  // @Get()
  // @Roles(UserRole.ADMIN)
  // async getAllTelegramAccounts(): Promise<TelegramAccount[]> {
  //   return await this.telegramServiceV2.getAllTelegramAccounts();
  // }
  @Get('accounts')
  @Roles(UserRole.CLIENT)
  async getTelegramAccounts(
    @CurrentUser() user: User,
  ): Promise<TelegramAccount[]> {
    const userId = user.id;
    return await this.telegramServiceV2.getTelegramAccounts(userId);
  }

  @Post('accounts')
  @Roles(UserRole.CLIENT)
  async createTelegramAccount(
    @Body() dto: TelegramInfoDto,
    @CurrentUser() user: User,
  ): Promise<TelegramAccount> {
    const userId = user.id;
    return await this.telegramServiceV2.createTelegramAccount(userId, dto);
  }

  @Patch('accounts/:id')
  @Roles(UserRole.CLIENT)
  async updateTelegramAccount(
    @Body() dto: TelegramInfoDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = user.id;
    return await this.telegramServiceV2.updateTelegramAccount(id, userId, dto);
  }

  @Delete('accounts/:id')
  @Roles(UserRole.CLIENT)
  async deleteTelegramAccount(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = user.id;
    return await this.telegramServiceV2.deleteTelegramAccount(id, userId);
  }

  @Get('accounts/:id/chatbots')
  @Roles(UserRole.CLIENT)
  async getTelegramChatbot(
    @CurrentUser() user: User,
    @Param('id') accountId: string,
  ): Promise<TelegramChatbot[]> {
    const userId = user.id;
    return await this.telegramServiceV2.getTelegramChatbotsByAccountIdAndUserId(
      accountId,
      userId,
    );
  }

  @Get('accounts/:accountId/chatbots/:chatbotId')
  @Roles(UserRole.CLIENT)
  async getTelegramChatbotById(
    @Param('accountId') accountId: string,
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: User,
  ): Promise<TelegramChatbot> {
    const userId = user.id;
    return await this.telegramServiceV2.getTelegramChatbotByAccountIdAndChatbotId(
      accountId,
      chatbotId,
      userId,
    );
  }

  @Post('accounts/:id/chatbots')
  @Roles(UserRole.CLIENT)
  async createTelegramChatbot(
    @Body() dto: TelegramChatbotDto,
    @Param('id') accountId: string,
    @CurrentUser() user: User,
  ): Promise<TelegramChatbot> {
    const userId = user.id;
    return await this.telegramServiceV2.createTelegramChatbot(
      accountId,
      userId,
      dto,
    );
  }

  @Patch('accounts/:accountId/chatbots/:chatbotId')
  @Roles(UserRole.CLIENT)
  async updateTelegramChatbot(
    @Body() dto: TelegramChatbotDto,
    @Param('accountId') accountId: string,
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = user.id;
    return await this.telegramServiceV2.updateTelegramChatbot(
      accountId,
      chatbotId,
      userId,
      dto,
    );
  }

  @Delete('accounts/:accountId/chatbots/:chatbotId')
  @Roles(UserRole.CLIENT)
  async deleteTelegramChatbot(
    @Param('accountId') accountId: string,
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const userId = user.id;
    return await this.telegramServiceV2.deleteTelegramChatbot(
      accountId,
      chatbotId,
      userId,
    );
  }

  @Post('accounts/:accountId/chatbots/:chatbotId/start')
  @Roles(UserRole.CLIENT)
  async startTelegramChatbot(
    @Param('accountId') accountId: string,
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: User,
  ): Promise<StartTelegramChatbotResponseDto> {
    const userId = user.id;
    return await this.telegramServiceV2.startTelegramChatbotByUser(
      accountId,
      chatbotId,
      userId,
    );
  }

  @Post('accounts/:accountId/chatbots/:chatbotId/stop')
  @Roles(UserRole.CLIENT)
  async stopTelegramChatbot(
    @Param('accountId') accountId: string,
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: User,
  ): Promise<StopTelegramChatbotResponseDto> {
    const userId = user.id;
    return await this.telegramServiceV2.stopTelegramChatbotByUser(
      accountId,
      chatbotId,
      userId,
    );
  }
}
