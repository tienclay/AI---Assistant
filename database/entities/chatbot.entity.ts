import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { Instruction, Persona } from 'src/common/enums';

@Entity()
export class Chatbot extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @JoinColumn({ name: 'created_by_id' })
  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @Column('text', { nullable: true })
  prompt: string;

  @Column({ type: 'simple-array', nullable: true })
  instruction: Instruction[];

  @Column({ type: 'simple-array', nullable: true })
  persona: Persona[];
}
