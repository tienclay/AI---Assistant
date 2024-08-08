import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class TelegramAccount extends BaseEntity {
  @Column('varchar')
  phoneNumber: string;

  @Column('varchar')
  apiId: string;

  @Column('varchar')
  apiHash: string;
}
