import { User } from '@entities';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ISubscriberPayload, Novu } from '@novu/node';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { SendAccountVerificationDto, SendOtpDto } from './dto';
import {
  AccountVerificationData,
  AuthIdentifyData,
  NOVU_QUEUE_JOBS,
  NOVU_QUEUE_NAME,
  OTPLoginJobData,
} from './queue';
import { NovuConfig } from 'src/config';
import { AuthPayload } from 'src/common/interfaces';

@Injectable()
export class NovuService extends Novu {
  constructor(
    @Inject(NovuConfig.KEY)
    private readonly config: ConfigType<typeof NovuConfig>,
    @InjectQueue(NOVU_QUEUE_NAME)
    private readonly novuQueue: Queue,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(config.novuApiKey, { backendUrl: config.novuServerUrl });
  }

  async getUserPayloadByEmail(email: string): Promise<AuthPayload> {
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

  async identifySubscriber(email: string): Promise<void> {
    const user = await this.getUserPayloadByEmail(email);

    const authIdentityData: AuthIdentifyData = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      metadata: {
        role: user.role,
      },
    };

    // add send email to processor
    await this.novuQueue.add(NOVU_QUEUE_JOBS.IDENTIFY_NOVU, authIdentityData);
  }

  async sendOtpToSubscriber(dto: SendOtpDto): Promise<void> {
    const user = await this.getUserPayloadByEmail(dto.email);

    const otpPayload: OTPLoginJobData = {
      userId: user.id,
      email: user.email,
      otp: dto.otp,
    };

    await this.novuQueue.add(NOVU_QUEUE_JOBS.SEND_OTP_LOGIN, otpPayload);
  }

  async sendAccountVerificationEmail(
    sendAccountVerificationDto: SendAccountVerificationDto,
  ): Promise<void> {
    const { email, userName } = sendAccountVerificationDto;
    const user = await this.getUserPayloadByEmail(email);
    const verificationPayload: AccountVerificationData = {
      userId: user.id,
      email: user.email,
      userName: userName,
    };

    await this.novuQueue.add(
      NOVU_QUEUE_JOBS.SEND_ACCOUNT_VERIFICATION_SUCCESS,
      verificationPayload,
    );
  }

  async getSubscriberByUserId(
    userId: string,
  ): Promise<AxiosResponse<any, any>> {
    return this.subscribers.get(userId);
  }

  async updateSubscriber(
    userId: string,
    data: ISubscriberPayload,
  ): Promise<AxiosResponse<any, any>> {
    return this.subscribers.update(userId, data);
  }

  async createSubscriber(
    userId: string,
    metadata: ISubscriberPayload,
  ): Promise<AxiosResponse<any, any>> {
    return this.subscribers.identify(userId, metadata);
  }
}
