import { User } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockedAccountService } from 'src/modules/otp-cache/locked-account.service';
import { OtpCacheService } from 'src/modules/otp-cache/otp-cache.service';
import { NovuModule } from 'src/modules/novu/novu.module';
import { AuthService } from '../auth.service';
import { AuthEmailController } from './auth-email.controller';
import { AuthEmailService } from './auth-email.service';
import { UserModule } from 'src/modules/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, NovuModule],
  providers: [
    AuthEmailService,
    OtpCacheService,
    AuthService,
    LockedAccountService,
  ],
  controllers: [AuthEmailController],
})
export class AuthEmailModule {}
