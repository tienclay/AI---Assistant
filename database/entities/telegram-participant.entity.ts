import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Chatbot } from './chatbot.entity';
import { TelegramChatbot } from './telegram.entity';

@Entity()
export class TelegramPartitipant extends BaseEntity {
  @Column()
  runId: string;

  @Column()
  telegramId: string;

  @JoinColumn({ name: 'telegram_id' })
  @ManyToOne(() => TelegramChatbot, (telegram) => telegram.id)
  telegram: TelegramChatbot;

  @Column()
  telegramUserId: string;
}
