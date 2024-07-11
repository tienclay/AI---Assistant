import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';

@Exclude()
export class AuthPayloadDto {
  @Expose()
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Thanh Vo' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Thanh Vo' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: UserStatus.ACTIVE })
  status: UserStatus;

  @Expose()
  @ApiProperty({ example: UserRole.ADMIN })
  role: UserRole;
}
