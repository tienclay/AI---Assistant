import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Chatbot extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @JoinColumn({ name: 'created_by_id' })
  @ManyToOne(() => User, (user) => user.id)
  creator: User;
}
