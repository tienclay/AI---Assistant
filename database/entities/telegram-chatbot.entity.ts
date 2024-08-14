import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TelegramAccount } from './telegram-account.entity';
import { Chatbot } from './chatbot.entity';
import { TelegramChatbotStatus } from 'src/common/enums';

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

  @Column('varchar', { unique: true })
  telegramChatbotId: string;

  @Column('varchar', { nullable: true })
  stringSession: string;

  @Column('varchar')
  token: string;

  @Column({
    type: 'enum',
    enum: TelegramChatbotStatus,
    default: TelegramChatbotStatus.INACTIVE,
  })
  status: TelegramChatbotStatus;
}
