import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { TelegramService } from '../social-media/telegram/telegram.service';
import { ScheduleJobService } from './schedule-job.service';
import { JobHistoryStatus } from 'src/common/enums/schedule-job.enum';
import {
  SCHEDULE_JOB_QUEUE_JOBS,
  SCHEDULE_JOB_QUEUE_NAME,
  ScheduleJobData,
} from './queue';

@Processor(SCHEDULE_JOB_QUEUE_NAME)
export class ScheduleJobProcessor {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly scheduleJobService: ScheduleJobService,
  ) {}

  @OnQueueCompleted()
  async processingSuccess(job: Job<ScheduleJobData>) {
    await this.updateJobHistory(job.data.id, JobHistoryStatus.SUCCESS);
  }

  @OnQueueFailed()
  async processingFailed(job: Job<ScheduleJobData>) {
    if (job.attemptsMade === job.opts.attempts) {
      await this.updateJobHistory(job.data.id, JobHistoryStatus.FAILED);
    }
  }

  private async updateJobHistory(jobId: string, status: JobHistoryStatus) {
    await this.scheduleJobService.createJobHistory({
      jobId,
      executionTime: new Date(),
      status,
    });

    await this.scheduleJobService.updateJobAfterExecution(jobId);
  }

  @Process(SCHEDULE_JOB_QUEUE_JOBS.TELEGRAM_AUTO_MESSAGE)
  async sendMessage(job: Job<ScheduleJobData>) {
    const scheduleJobData = job.data;
    const telegramData = scheduleJobData.data;
    const telegramClient =
      this.telegramService.getRunningTelegramChatbotByChatbotId(
        telegramData.chatbotId,
      );

    await this.telegramService.sendTelegramMessageBack(
      telegramClient,
      telegramData.chatId,
      telegramData.content,
    );
  }
}
