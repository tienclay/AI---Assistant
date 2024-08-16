import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { TelegramChatbot } from './telegram-chatbot.entity';

@Entity()
@Unique(['apiId', 'apiHash'])
export class TelegramAccount extends BaseEntity {
  @Column('varchar', { unique: true })
  phoneNumber: string;

  @Column('varchar')
  apiId: string;

  @Column('varchar')
  apiHash: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  userId: string;

  chatbots: TelegramChatbot[];
}
