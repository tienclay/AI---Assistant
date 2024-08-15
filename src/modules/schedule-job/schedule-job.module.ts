import { Module } from '@nestjs/common';
import { ScheduleJobService } from './schedule-job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleJob } from 'database/entities/schedule-job.entity';
import { JobExecutionHistory } from 'database/entities/task-execution-history.entity';
import { ScheduleJobController } from './schedule-job.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ScheduleJobProcessor } from './schedule-job.processor';
import { TelegramModule } from '../social-media/telegram/telegram.module';
import { SCHEDULE_JOB_QUEUE_NAME } from './queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleJob, JobExecutionHistory]),
    ScheduleModule.forRoot(),
    TelegramModule,
    BullModule.registerQueue({
      name: SCHEDULE_JOB_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
      },
    }),
  ],
  providers: [ScheduleJobService, ScheduleJobProcessor],
  controllers: [ScheduleJobController],
})
export class ScheduleJobModule {}
