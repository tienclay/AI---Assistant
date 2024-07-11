import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from 'src/modules/admin/admin.service';
import { OtpCacheService } from 'src/modules/otp-cache/otp-cache.service';
import { LockedAccountService } from 'src/modules/otp-cache/locked-account.service';
import { NovuService } from 'src/modules/novu/novu.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import {
  EmailInputDto,
  EmailRegisterInputDto,
  EmailRegisterResponseDto,
  LoginDto,
  OtpDto,
  SendOtpResponseDto,
} from './dtos';
import { AIAssistantBadRequestException } from 'src/common/infra-exception';
import { plainToInstance } from 'class-transformer';
import { UserStatus } from 'src/common/enums';
import { AuthToken } from '../dto';
import { AuthPayload } from 'src/common/interfaces';
import { otpConfig } from 'src/config/otp.config';
import { v4 as uuidv4 } from 'uuid';
import { ResendRemainingDto } from 'src/modules/otp-cache/dtos/resend-remain.dto';

@Injectable()
export class AuthEmailService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly otpCacheService: OtpCacheService,
    private readonly lockedAccountService: LockedAccountService,
    private readonly novuService: NovuService,

    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRedis() private readonly redis: Redis,
  ) {}

  logout() {
    return 'logout';
  }
  async getPayloadByEmail(email: string): Promise<AuthPayload> {
    const userData = await this.userRepository.findOneByOrFail({
      email,
    });

    return {
      email: userData.email,
      role: userData.role,
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  }

  async register(
    registerDto: EmailRegisterInputDto,
  ): Promise<EmailRegisterResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new AIAssistantBadRequestException('User already exists');
    }

    const newUser = await this.createUser(registerDto);

    if (!newUser) {
      throw new AIAssistantBadRequestException('Could not create new user');
    }

    await this.novuService.identifySubscriber(newUser.email);
    const otp = await this.sendOtp({ email: newUser.email });
    // emit notification event

    return plainToInstance(EmailRegisterResponseDto, {
      ...newUser,
      sessionId: otp.sessionId,
    });
  }

  private async createUser(registerDto: EmailRegisterInputDto) {
    const newUser = this.userRepository.create({
      ...registerDto,
      status: UserStatus.INACTIVE,
    });

    return this.userRepository.save(newUser);
  }

  async login(loginDto: LoginDto): Promise<AuthToken> {
    await this.validateOtp(loginDto);

    const userPayload = await this.getPayloadByEmail(loginDto.email);

    const authToken = this.authService.generateAccessToken(userPayload);

    await this.clearOtpData(loginDto.email, loginDto.sessionId);

    return plainToInstance(AuthToken, {
      accessToken: authToken.accessToken,
    });
  }

  async activeUser(loginDto: LoginDto): Promise<AuthToken> {
    await this.validateOtp(loginDto);
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });
    if (!user) {
      throw new AIAssistantBadRequestException('User not found');
    }
    await this.userRepository.update(
      { email: loginDto.email },
      {
        status: UserStatus.ACTIVE,
      },
    );
    const userPayload = await this.getPayloadByEmail(loginDto.email);

    const authToken = this.authService.generateAccessToken(userPayload);

    await this.clearOtpData(loginDto.email, loginDto.sessionId);

    return plainToInstance(AuthToken, {
      accessToken: authToken.accessToken,
    });
  }

  private async validateOtp(loginDto: LoginDto) {
    const validOtp = await this.otpCacheService.getOtpByEmailAndSession(
      loginDto.email,
      loginDto.sessionId,
    );

    if (!validOtp) {
      throw new AIAssistantBadRequestException('OTP is expired');
    }

    if (validOtp.code !== loginDto.otp) {
      await this.handleInvalidOtp(validOtp, loginDto);
    }

    return validOtp;
  }

  private async handleInvalidOtp(validOtp: OtpDto, loginDto: LoginDto) {
    const resendRemaining = await this.otpCacheService.getResendRemaining(
      loginDto.email,
    );

    if (validOtp.submissionRemaining <= 0) {
      if (resendRemaining.remaining > 0) {
        throw new AIAssistantBadRequestException(
          'Wrong OTP more than 3 times. Let resend OTP',
        );
      } else {
        await this.lockAccount(loginDto.email, resendRemaining);
      }
    } else {
      await this.otpCacheService.updateSubmissionRemaining(
        loginDto.email,
        loginDto.sessionId,
        validOtp.submissionRemaining - 1,
      );
      throw new AIAssistantBadRequestException('Wrong OTP', {
        submissionRemaining: validOtp.submissionRemaining - 1,
      });
    }
  }

  private async lockAccount(
    email: string,
    resendRemaining: ResendRemainingDto,
  ) {
    const lockTime = resendRemaining.isLockedBefore
      ? otpConfig.locked_account_24h
      : otpConfig.locked_account_1h;
    await this.lockedAccountService.setLockedAccount(
      email,
      { lockedDate: new Date() },
      lockTime,
    );

    const newResendRemaining: ResendRemainingDto = {
      remaining: resendRemaining.remaining + 1,
      isLockedBefore: true,
    };

    await this.otpCacheService.setResendRemaining(email, newResendRemaining);
    throw new AIAssistantBadRequestException(
      `You have entered wrong OTP many times. Waiting for ${lockTime === otpConfig.locked_account_1h ? '1 hour' : '24 hours'} to send OTP again`,
    );
  }

  private async clearOtpData(email: string, sessionId: string) {
    await this.otpCacheService.deleteResendRemaining(email);
    await this.otpCacheService.deleteOtp(email, sessionId);
  }

  async sendOtp(
    inputEmailDto: EmailInputDto,
  ): Promise<Partial<SendOtpResponseDto>> {
    const isRegister = await this.isRegisteredEmail(inputEmailDto.email);
    if (!isRegister) {
      return {
        isSent: false,
      };
    }
    const resendRemaining = await this.otpCacheService.getResendRemaining(
      inputEmailDto.email,
    );

    if (!resendRemaining) {
      // First login, resendRemaining is null
      return this.handleFirstLogin(inputEmailDto);
    } else if (resendRemaining.remaining <= 0) {
      // Exceed resend limit
      return this.handleExceededResendLimit(inputEmailDto.email);
    } else {
      // Not the first login and not exceed resend limit
      return this.handleResendOtp(inputEmailDto, resendRemaining);
    }
  }

  private async handleFirstLogin(
    inputEmailDto: EmailInputDto,
  ): Promise<Partial<SendOtpResponseDto>> {
    const resendRemaining: ResendRemainingDto = {
      remaining: otpConfig.max_submission_remaining,
    };
    await this.otpCacheService.setResendRemaining(
      inputEmailDto.email,
      resendRemaining,
    );

    const sentOtpResponse = await this.saveAndSendOtp(inputEmailDto);
    return plainToInstance(SendOtpResponseDto, sentOtpResponse);
  }

  private async handleExceededResendLimit(
    email: string,
  ): Promise<Partial<SendOtpResponseDto>> {
    const resendExpireTime =
      await this.otpCacheService.getResendExpireTime(email);

    if (resendExpireTime) {
      throw new AIAssistantBadRequestException(
        `OTP has been sent before, waiting for ${resendExpireTime} seconds to send OTP again`,
        { resendExpireTime },
      );
    }

    const lockedAccount =
      await this.lockedAccountService.getLockedAccount(email);

    if (!lockedAccount) {
      const resendRemaining =
        await this.otpCacheService.getResendRemaining(email);
      await this.lockAccount(email, resendRemaining);
    }

    const time = await this.lockedAccountService.getLockedAccountTTL(email);
    const formattedTime = this.formatTime(time);
    throw new AIAssistantBadRequestException(
      `You have resent many times. Please wait ${formattedTime} to send OTP again`,
      { waitingTime: time },
    );
  }

  private async handleResendOtp(
    inputEmailDto: EmailInputDto,
    resendRemaining: ResendRemainingDto,
  ): Promise<Partial<SendOtpResponseDto>> {
    const resendExpireTime = await this.otpCacheService.getResendExpireTime(
      inputEmailDto.email,
    );

    if (resendExpireTime) {
      throw new AIAssistantBadRequestException(
        `OTP has been sent before, waiting for ${resendExpireTime} seconds to send OTP again`,
        { resendExpireTime },
      );
    }

    const newResendRemaining: ResendRemainingDto = {
      remaining: resendRemaining.remaining - 1,
    };
    await this.otpCacheService.setResendRemaining(
      inputEmailDto.email,
      newResendRemaining,
    );

    const sentOtpResponse = await this.saveAndSendOtp(inputEmailDto);
    return plainToInstance(SendOtpResponseDto, sentOtpResponse);
  }

  async isRegisteredEmail(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        return false;
      }

      return true;
    } catch (error) {
      throw new AIAssistantBadRequestException(error.message);
    }
  }

  async saveAndSendOtp(
    inputEmailDto: EmailInputDto,
  ): Promise<SendOtpResponseDto> {
    const newOtp: OtpDto = {
      otp: {
        code: this.generateOTP(),
      },
      expireTime: otpConfig.otp_expire_time,
    };

    const sessionId = uuidv4();
    await this.otpCacheService.saveOtp(
      inputEmailDto.email,
      sessionId,
      newOtp.otp,
    );

    const sentOtpResponse: SendOtpResponseDto = {
      isSent: true,
      expireTime: newOtp.expireTime,
      sessionId,
      resendExpireTime: otpConfig.otp_resend_time,
    };

    await this.novuService.sendOtpToSubscriber({
      email: inputEmailDto.email,
      otp: newOtp.otp.code,
    });
    return sentOtpResponse;
  }

  generateOTP(): string {
    return Math.random().toString(10).substring(2, 6);
  }

  formatTime(seconds) {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  }
}
