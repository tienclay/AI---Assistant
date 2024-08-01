import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
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
import { Observable } from 'rxjs';
import { fromJSON } from '@grpc/proto-loader';
import { DiscordService } from './discord/discord.service';
import { ChatbotDiscordInfo } from './discord/dtos/info-chatbot.dto';
import { ChatbotDiscordToken } from './discord/dtos/input-chatbot-token.dto';
import { DiscordGuard } from './guards';
import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { getRandomEmoji } from './discord/utils';
dotenv.config();

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

@Controller('social-media')
@ApiTags('Social media')
@DiscordServiceControllerMethods()
export class SocialMediaController {
  constructor(
    private readonly fbService: FacebookService,
    private readonly discordService: DiscordService,
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

  @Post('discord/interactions')
  async handleDiscordInteraction(@Body() body: any, @Res() res: Response) {
    const { type, data } = body;
    const channelId = body.channel_id;
    const userId = body.member.user.id;
    const message = body.data.options[0].value;

    const resData = await this.discordService.interaction(
      type,
      data,
      message,
      channelId,
      userId,
    );
    res.send(resData);
  }
}
