import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TelegramAccount } from './telegram-account.entity';
import { Chatbot } from './chatbot.entity';

@Entity()
export class TelegramChatbot extends BaseEntity {
  @JoinColumn({ name: 'chatbot_id' })
  @ManyToOne(() => Chatbot)
  chatbot: Chatbot;

  @Column('uuid')
  chatbotId: string;

  @JoinColumn({ name: 'account_id' })
  @ManyToOne(() => TelegramAccount)
  account: TelegramAccount;

  @Column('uuid')
  accountId: string;

  @Column('varchar')
  telegramChatbotId: string;

  @Column('varchar')
  token: string;
}
