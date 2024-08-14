import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ScheduleJob } from './schedule-job.entity';

enum JobStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class TaskExecutionHistory extends BaseEntity {
  @Column('uuid')
  jobId: string;

  @ManyToOne(() => ScheduleJob, (scheduledJob) => scheduledJob.id)
  @JoinColumn({ name: 'job_id' })
  scheduleJob: ScheduleJob;

  @Column('timestamptz')
  executionTime: Date;

  @Column('enum', { enum: JobStatus })
  status: JobStatus;
}
