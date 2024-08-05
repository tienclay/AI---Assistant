import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Chatbot } from './chatbot.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class ChatbotDiscord extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  discordToken: string;

  @Column({ type: 'varchar', nullable: true })
  publicKey: string;

  @Column({ type: 'varchar', nullable: true })
  appId: string;

  @Column({ type: 'varchar', nullable: true })
  chatbotId: string;

  @JoinColumn({ name: 'chatbot_id' })
  @ManyToOne(() => Chatbot, (chatbot) => chatbot.id)
  chatbot: Chatbot;
}
