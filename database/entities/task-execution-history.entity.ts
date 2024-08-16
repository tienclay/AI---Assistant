import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ScheduleJob } from './schedule-job.entity';
import { JobHistoryStatus } from 'src/common/enums';

@Entity()
export class JobExecutionHistory extends BaseEntity {
  @Column('uuid')
  jobId: string;

  @ManyToOne(() => ScheduleJob, (scheduledJob) => scheduledJob.id)
  @JoinColumn({ name: 'job_id' })
  scheduleJob: ScheduleJob;

  @Column('timestamptz')
  executionTime: Date;

  @Column('enum', { enum: JobHistoryStatus })
  status: JobHistoryStatus;
}
