import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import * as dotenv from 'dotenv';
import { verifyKeyMiddleware } from 'discord-interactions';

dotenv.config();

@Injectable()
export class VerifyKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    verifyKeyMiddleware(process.env.PUBLIC_KEY)(req, res, next);
  }
}
