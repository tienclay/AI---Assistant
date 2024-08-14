import { Module } from '@nestjs/common';
import { ScheduleJobService } from './schedule-job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleJob } from 'database/entities/schedule-job.entity';
import { TaskExecutionHistory } from 'database/entities/task-execution-history.entity';
import { ScheduleJobController } from './schedule-job.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ScheduleJobProcessor } from './schedule-job.processor';
import { TelegramModule } from '../social-media/telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleJob, TaskExecutionHistory]),
    ScheduleModule.forRoot(),
    TelegramModule,
    BullModule.registerQueue({
      name: 'SCHEDULE_TASK',
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
