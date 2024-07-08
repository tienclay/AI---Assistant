import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Knowledge extends BaseEntity {
  @Column({ type: 'varchar' })
  plainText: string;

  @Column({ type: 'uuid', array: true, nullable: true })
  linkIds: string[];

  @Column({ type: 'uuid', array: true, nullable: true })
  fileUrls: string[];
}
