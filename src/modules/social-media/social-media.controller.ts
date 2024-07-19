import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

@Controller('social-media')
@ApiTags('Social media')
export class SocialMediaController {
  constructor() {}

  @Get('facebook/webhooks')
  async getwebhook(req: Request, res: Response) {
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Respond with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }

  @Post('facebook/webhooks')
  async postwebhook(req: Request, res: Response) {
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
