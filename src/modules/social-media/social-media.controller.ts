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
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('req :>> ', req);
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
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

    console.log('body :>> ', body);

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
          this.fbService.handleMessage(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
          this.fbService.handlePostback(senderPsid, webhookEvent.postback);
        }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }
}
