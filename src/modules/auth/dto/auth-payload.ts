import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

@Exclude()
export class AuthPayloadDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  status: UserStatus;

  @Expose()
  role: UserRole;
}
