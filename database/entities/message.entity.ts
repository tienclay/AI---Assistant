import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { MessageSender } from 'src/common/enums';
import { Participant } from './participant.entity';

@Entity()
export class Message extends BaseEntity {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'enum', enum: MessageSender })
  messageSender: MessageSender;

  @Column({ type: 'uuid' })
  participantId: string;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;
}
