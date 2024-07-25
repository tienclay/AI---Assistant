import { BullModuleOptions } from '@nestjs/bull';
import { registerAs } from '@nestjs/config';

export default registerAs<BullModuleOptions>('bull', () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
}));

export const bullQueueName = {
  SEND_AI_MESSAGE: 'send-ai-message',
};
