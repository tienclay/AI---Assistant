import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyKeyMiddleware } from 'discord-interactions';

@Injectable()
export class DiscordGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const discordToken = headers.get('discord-token');
    if (!discordToken) {
      throw new UnauthorizedException();
    }
    try {
      verifyKeyMiddleware(discordToken);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
