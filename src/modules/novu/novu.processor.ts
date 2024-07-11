import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { NovuService } from './novu.service';
import {
  AuthIdentifyData,
  NOVU_QUEUE_JOBS,
  NOVU_QUEUE_NAME,
  OTPLoginJobData,
} from './queue';

@Processor(NOVU_QUEUE_NAME)
export class NovuProcessor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly novuService: NovuService,
  ) {}

  @Process({ name: NOVU_QUEUE_JOBS.IDENTIFY_NOVU, concurrency: 1 })
  async identifyNovu(job: Job<AuthIdentifyData>): Promise<void> {
    const { userId, email, firstName, lastName, metadata } = job.data;
    try {
      const response = await this.novuService.getSubscriberByUserId(userId);

      if (response.data) {
        await this.novuService.updateSubscriber(userId, {
          email,
          firstName,
          lastName,
          data: {
            role: metadata.role,
          },
        });
      }
    } catch (error) {
      try {
        await this.novuService.createSubscriber(userId, {
          email,
          firstName,
          lastName,
          data: {
            role: metadata.role,
          },
        });
      } catch (e) {
        this.logger.error(`Can't create or update user to novu`, {
          context: `${NovuProcessor.name}.${this.identifyNovu.name}`,
          userId,
          error,
        });
      }
    }
  }

  @Process(NOVU_QUEUE_JOBS.SEND_OTP_LOGIN)
  async sendOtpMail(job: Job<OTPLoginJobData>): Promise<void> {
    const { email, userId, otp } = job.data;

    try {
      await this.novuService.trigger(NOVU_QUEUE_JOBS.SEND_OTP_LOGIN, {
        to: {
          subscriberId: userId,
          email,
        },
        payload: {
          otp,
        },
      });
    } catch (error) {
      this.logger.error(`Can't send otp email.`, {
        context: `${NovuProcessor.name}.${this.sendOtpMail.name}`,
        userId,
        error,
      });
    }
  }
}
