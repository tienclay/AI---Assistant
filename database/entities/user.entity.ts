import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { PhoneCode } from 'src/common/enums';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: PhoneCode, nullable: true })
  phoneCode: PhoneCode;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;
}
