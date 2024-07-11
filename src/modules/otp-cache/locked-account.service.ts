import { InjectRedis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { LockedDateDto } from './dtos';

@Injectable()
export class LockedAccountService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async setLockedAccount(
    email: string,
    lockedDate: LockedDateDto,
    lockedTime: number,
  ): Promise<boolean> {
    const key = `locked_accounts:${email}`;
    await this.redis.hset(key, lockedDate);
    await this.redis.expire(key, lockedTime);
    return true;
  }

  async getLockedAccount(email: string): Promise<any> {
    const key = `locked_accounts:${email}`;
    const lockedAccount = await this.redis.hgetall(key);
    if (Object.keys(lockedAccount).length === 0) {
      return null;
    }

    return lockedAccount;
  }

  async deleteLockedAccount(email: string): Promise<boolean> {
    const key = `locked_accounts:${email}`;
    await this.redis.del(key);
    return true;
  }

  async getLockedAccountTTL(email: string): Promise<number> {
    const key = `locked_accounts:${email}`;
    const ttl = await this.redis.ttl(key);
    return ttl;
  }
}
