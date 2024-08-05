import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class ChatbotDiscord extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  discordToken: string;

  @Column({ type: 'varchar', nullable: true })
  publicKey: string;

  @Column({ type: 'varchar', nullable: true })
  appId: string;
}
