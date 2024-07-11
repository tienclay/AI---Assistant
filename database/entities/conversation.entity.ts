import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Chatbot } from './chatbot.entity';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation extends BaseEntity {
  @Column()
  chatbotId: string;

  @ManyToOne(() => Chatbot)
  @JoinColumn({ name: 'chatbot_id' })
  chatbot: Chatbot;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar' })
  participantId: string;

  @Column({ type: 'uuid', nullable: true })
  lastMessageId: string;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message;
}
