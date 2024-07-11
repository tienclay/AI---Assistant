import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
export default registerAs('novu', () => ({
  novuApiKey: process.env.NOVU_API_KEY || '',
  novuServerUrl: process.env.NOVU_SERVER_URL || '',
}));
