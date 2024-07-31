import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Channel extends BaseEntity {
  @Column()
  chatbotId: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.id)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column()
  channelId: string;
}
