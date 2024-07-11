import { otpConfig } from './../../config/otp.config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import Redis from 'ioredis';
import { OtpDataDto } from './dtos';
import { ResendRemainingDto } from './dtos/resend-remain.dto';

@Injectable()
export class OtpCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async setResendExpireTime(email: string) {
    try {
      const key = `login_otp:${email}:resendExpireTime`;
      await this.redis.set(
        key,
        `Waiting ${otpConfig.otp_expire_time} to send OTP again`,
      );
      await this.redis.expire(key, otpConfig.otp_resend_time);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getResendExpireTime(email: string) {
    try {
      const key = `login_otp:${email}:resendExpireTime`;
      const ttl = await this.redis.ttl(key);
      // Handle key not found gracefully
      if (ttl === -2) {
        return null; // Key doesn't exist
      } else if (ttl === -1) {
        return null; // Key exists but has no expiration
      }
      return ttl;
    } catch (error) {
      return null;
    }
  }

  async setResendRemaining(
    email: string,
    remaining: ResendRemainingDto,
  ): Promise<boolean> {
    const key = `login_otp:${email}:resendOTP-remaining`;
    await this.redis.hset(key, remaining);
    return true;
  }

  async getResendRemaining(email: string): Promise<ResendRemainingDto> {
    const key = `login_otp:${email}:resendOTP-remaining`;
    const resendRemaining = await this.redis.hgetall(key);
    if (Object.keys(resendRemaining).length === 0) {
      return null;
    }
    const result: ResendRemainingDto = {
      remaining: parseInt(resendRemaining.remaining),
      isLockedBefore: resendRemaining.isLockedBefore === 'true',
    };
    return result;
  }

  async deleteResendRemaining(email: string): Promise<boolean> {
    const key = `login_otp:${email}:resendOTP-remaining`;
    const deleteRemaining = await this.redis.del(key);
    if (!deleteRemaining) {
      return false;
    }
    return true;
  }

  async getSessionsByEmail(email: string): Promise<string[]> {
    const sessions = [];
    let cursor = 0; // Initial cursor

    const pattern = `login_otp:${email}:*`;

    do {
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
      );

      sessions.push(...keys); // Add matching keys to the results
      cursor = parseInt(nextCursor);
    } while (cursor !== 0); // Loop until all keys are scanned

    return sessions;
  }

  async saveOtp(
    email: string,
    session: string,
    otp: OtpDataDto,
  ): Promise<boolean> {
    try {
      const key = `login_otp:${email}:${session}`;
      await this.redis.hset(key, otp);
      await this.redis.expire(key, otpConfig.otp_expire_time);
      await this.setResendExpireTime(email);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getOtpByKey(key: string): Promise<any> {
    const otp = await this.redis.hgetall(key);
    if (Object.keys(otp).length === 0) {
      return null;
    }
    return otp;
  }

  async getOtpByEmailAndSession(email: string, session: string): Promise<any> {
    const key = `login_otp:${email}:${session}`;
    const otp = await this.redis.hgetall(key);
    if (Object.keys(otp).length === 0) {
      return null;
    }
    return otp;
  }

  async deleteOtp(email: string, session: string): Promise<boolean> {
    const key = `login_otp:${email}:${session}`;
    const deleteOtp = await this.redis.del(key);
    if (!deleteOtp) {
      return false;
    }
    return true;
  }

  async getOtpTTL(email: string, session?: string): Promise<number> {
    const key = `login_otp:${email}:${session}`;
    const ttl = await this.redis.ttl(key);
    return ttl;
  }

  async updateSubmissionRemaining(
    email: string,
    session: string,
    newSubmissionRemaining: number,
  ): Promise<boolean> {
    // Retrieve the current OTP data
    const otp: OtpDataDto = await this.getOtpByEmailAndSession(email, session);

    // Update the submissionRemaining property
    otp.submissionRemaining = newSubmissionRemaining;

    // Save the updated OTP data back to Redis
    const key = `login_otp:${email}:${session}`;
    await this.redis.hset(key, otp);
    return true;
  }
}
