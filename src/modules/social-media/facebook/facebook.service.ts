import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';

export class FacebookService {
  constructor(private readonly httpService: HttpService) {}

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

  async handlePostback(senderPsid, request: Request, receivedPostback) {
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
