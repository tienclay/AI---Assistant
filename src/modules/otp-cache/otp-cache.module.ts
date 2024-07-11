import { Module } from '@nestjs/common';
import { LockedAccountService } from './locked-account.service';
import { OtpCacheService } from './otp-cache.service';
import { CacheConfig } from 'src/config';
import { ConfigType } from '@nestjs/config';
import cacheConfig from 'src/config/cache.config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [CacheConfig.KEY],
      isGlobal: true,
      useFactory: (config: ConfigType<typeof cacheConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without cache config');
        }
        return config;
      },
    }),
  ],
  providers: [OtpCacheService, LockedAccountService],
})
export class OtpCacheModule {}
