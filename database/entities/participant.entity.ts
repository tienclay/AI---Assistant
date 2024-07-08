import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Participant extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;
}
