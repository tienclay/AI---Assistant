import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from 'src/common/enums';

@Exclude()
export class EmailRegisterInputDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @Expose()
  @IsString()
  @Length(1, 128)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    minLength: 1,
    maxLength: 128,
    example: 'John',
  })
  firstName: string;

  @Expose()
  @IsString()
  @Length(1, 128)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    minLength: 1,
    maxLength: 128,
    example: 'John',
  })
  lastName: string;

  @Expose()
  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ example: UserRole.CLIENT })
  role: UserRole;
}
