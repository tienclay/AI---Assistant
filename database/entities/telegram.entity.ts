import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Chatbot } from './chatbot.entity';

@Entity()
export class TelegramChatbot extends BaseEntity {
  @Column()
  chatbotId: string;

  @JoinColumn({ name: 'chatbot_id' })
  @ManyToOne(() => Chatbot, (chatbot) => chatbot.id)
  chatbot: Chatbot;

  @Column()
  telegramBotId: string;
}
