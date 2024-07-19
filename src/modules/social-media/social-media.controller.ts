import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { FacebookService } from './facebook/facebook.service';
dotenv.config();

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

@Controller('social-media')
@ApiTags('Social media')
export class SocialMediaController {
  constructor(private readonly fbService: FacebookService) {}

  @Get('facebook/webhooks')
  async getwebhook(@Req() req: Request, @Res() res: Response) {
    return this.fbService.handleGetWebhook(req, res);
  }

  @Post('facebook/webhooks')
  async postwebhook(@Req() req: Request, @Res() res: Response) {
    return this.fbService.handleSendWebhook(req, res);
  }
}
