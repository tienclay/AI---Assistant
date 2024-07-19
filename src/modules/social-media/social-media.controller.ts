import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

@Controller('social-media')
@ApiTags('Social media')
export class SocialMediaController {
  constructor() {}

  @Get('facebook/webhooks')
  async getwebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: any,
  ) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('dto :>> ', dto);

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct

      if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }

  @Post('facebook/webhooks')
  async postwebhook(@Req() req: Request, @Res() res: Response) {
    let body = req.body;

    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, { depth: null });
    // Send a 200 OK response if this is a page webhook

    if (body.object === 'page') {
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
      // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }
}
