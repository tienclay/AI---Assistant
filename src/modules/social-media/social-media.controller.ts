import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { FacebookService } from './facebook/facebook.service';
import {
  DiscordServiceControllerMethods,
  MessageRequest,
  MessageResponse,
} from './discord/discord.pb';
import { DiscordService } from './discord/discord.service';
import { ChatbotDiscordInfo } from './discord/dtos/info-chatbot.dto';
import { ChatbotDiscordToken } from './discord/dtos/input-chatbot-token.dto';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { TelegramService } from './telegram/telegram.service';

dotenv.config();

@Controller('social-media')
@ApiTags('Social media')
@DiscordServiceControllerMethods()
export class SocialMediaController {
  constructor(
    private readonly fbService: FacebookService,
    private readonly discordService: DiscordService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get('facebook/webhooks')
  async getwebhook(@Req() req: Request, @Res() res: Response) {
    return this.fbService.handleGetWebhook(req, res);
  }

  @Post('facebook/webhooks')
  async postwebhook(@Req() req: Request, @Res() res: Response) {
    return this.fbService.handleSendWebhook(req, res);
  }

  async sendMessage(dto: MessageRequest): Promise<MessageResponse> {
    const message = dto.message;

    return { response: message };
  }
  @Post('discord/:chatbotId/install-commands')
  async installCommands(@Param('chatbotId') id: string) {
    // Install global commands to Discord
    await this.discordService.installCommands(id);
  }

  @Patch('discord/:chatbotId/update-info')
  async updateChatbotInfo(
    @Query('chatbotId') chatbotId: string,
    @Body() body: ChatbotDiscordInfo,
  ): Promise<string> {
    return await this.discordService.updateChatbotInfo(chatbotId, body);
  }

  @Patch('discord/:chatbotId/update-token')
  async updateChatbotToken(
    @Query('chatbotId') chatbotId: string,
    @Body() body: ChatbotDiscordToken,
  ): Promise<string> {
    return await this.discordService.updateChatbotToken(chatbotId, body);
  }

  @Post('discord/:chatbotid/interactions')
  @HttpCode(HttpStatus.OK)
  async handleDiscordInteraction(
    @Body() body: any,

    @Param('chatbotid') chatbotId: string,
  ) {
    const { type, data, application_id } = body;
    const appId = application_id;
    if (type === InteractionType.PING) {
      return { type: InteractionResponseType.PONG };
    }
    const channelId = body.channel_id;
    const user = body.member.user ? body.member.user : null;
    const message = body.data.options[0].value;

    this.discordService.interaction(
      type,
      data,
      message,
      channelId,
      user,
      chatbotId,
      appId,
    );

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `Your's request is being processed`,
      },
    };
  }
}
