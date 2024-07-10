import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Knowledge extends BaseEntity {
  @Column({ type: 'uuid' })
  chatbotId: string;

  @Column({ type: 'varchar' })
  plainText: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  websiteUrls: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  pdfUrls: string[];
}
