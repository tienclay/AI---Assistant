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
import { Conversation } from './conversation.entity';

@Entity()
export class Message extends BaseEntity {
  @Column({ type: 'varchar' })
  conversationId: string;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'enum', enum: MessageSender })
  messageSender: MessageSender;

  @Column({ type: 'uuid', nullable: true })
  participantId: string;

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant;
}
