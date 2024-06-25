import { IsEnum, IsString } from 'class-validator';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

export class UserInputDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  @IsEnum(UserRole)
  role: UserRole;
}
