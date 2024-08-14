import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { JobStatus } from 'src/common/enums/schedule-job.enum';

export class JobData {
  chatbotId: string;
  chatId: string;
  content: string;
}

@Entity()
export class ScheduleJob extends BaseEntity {
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { nullable: true })
  interval: number;

  @Column('boolean', { default: false })
  isRecurring: boolean;

  @Column('timestamptz')
  nextExecutionTime: Date;

  @Column('enum', { enum: JobStatus, default: JobStatus.PENDING })
  status: JobStatus;

  @Column('jsonb')
  data: JobData;

  @Column('boolean', { default: true })
  active: boolean;
}
