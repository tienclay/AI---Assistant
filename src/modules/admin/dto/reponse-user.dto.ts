import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

@Exclude()
export class UserOutputDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  status: UserStatus;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date | null;
}
