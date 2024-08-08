import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TelegramChatbot } from './telegram-chatbot.entity';

@Entity()
export class TelegramParticipant extends BaseEntity {
  @Column('uuid')
  runId: string;

  @Column('varchar')
  telegramChatId: string;

  @Column('varchar')
  telegramUserId: string;

  @Column('uuid')
  telegramChatbotId: string;

  @JoinColumn({ name: 'telegram_chatbot_id' })
  @ManyToOne(() => TelegramChatbot)
  telegramChatbot: TelegramChatbot;
}
