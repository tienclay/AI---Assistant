import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

@Injectable()
export class FacebookService {
  constructor(private readonly httpService: HttpService) {}

  async hello() {
    return 'Hello World!';
  }

  async handleGetWebhook(req: Request, res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

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

  async handleSendWebhook(req: Request, res: Response) {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(async (entry) => {
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        console.log('Sender PSID: ' + senderPsid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
          this.handleMessage(senderPsid, webhookEvent.message, req);
        } else if (webhookEvent.postback) {
          this.handlePostback(senderPsid, webhookEvent.postback, req);
        }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }

  async handleMessage(senderPsid, receivedMessage, request: Request) {
    let response;

    // Checks if the message contains text
    if (receivedMessage.text) {
      // Create the payload for a basic text message, which
      // will be added to the body of your request to the Send API
      response = {
        text: `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`,
      };
    } else if (receivedMessage.attachments) {
      // Get the URL of the message attachment
      let attachmentUrl = receivedMessage.attachments[0].payload.url;
      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this the right picture?',
                subtitle: 'Tap a button to answer.',
                image_url: attachmentUrl,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Yes!',
                    payload: 'yes',
                  },
                  {
                    type: 'postback',
                    title: 'No!',
                    payload: 'no',
                  },
                ],
              },
            ],
          },
        },
      };
    }

    // Send the response message
    this.callSendAPI(senderPsid, request, response);
  }

  async handlePostback(senderPsid, receivedPostback, request: Request) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { text: 'Thanks!' };
    } else if (payload === 'no') {
      response = { text: 'Oops, try sending another image.' };
    }
    // Send the message to acknowledge the postback
    this.callSendAPI(senderPsid, request, response);
  }

  async callSendAPI(senderPsid, request: Request, response: Response) {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = process.env.FB_VERIFY_ACCESS_TOKEN;

    // Construct the message body
    let requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    };

    // Send the HTTP request to the Messenger Platform

    await this.httpService.post(
      'https://graph.facebook.com/v2.6/me/messages',
      requestBody,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
        },
      },
    );
  }
}
