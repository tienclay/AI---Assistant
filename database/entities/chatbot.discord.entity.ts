import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Chatbot } from './chatbot.entity';

@Entity()
export class ChatbotDiscord extends Chatbot {
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
