import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TelegramService } from '../social-media/telegram/telegram.service';
import { ScheduleJobService } from './schedule-job.service';

@Processor('SCHEDULE_TASK')
export class ScheduleJobProcessor {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly scheduleJobService: ScheduleJobService,
  ) {}

  onModuleInit(): void {
    console.log(1111);
  }

  @Process('handle-shedule-task')
  async sendMessage(job: Job<any>) {
    const scheduleTaskData = job.data;

    console.log(scheduleTaskData);

    const telegramData = scheduleTaskData.data;
    const telegramClient =
      this.telegramService.getRunningTelegramChatbotByChatbotId(
        telegramData.chatbotId,
      );

    await this.telegramService.sendTelegramMessageBack(
      telegramClient,
      telegramData.chatId,
      telegramData.content,
    );

    await this.scheduleJobService.updateTaskAfterExecution(scheduleTaskData.id);
  }
}
