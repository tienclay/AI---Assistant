import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserStatus } from 'src/common/enums/user.enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;
}
