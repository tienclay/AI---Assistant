import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginPasswordDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: '12345678' })
  password: string;
}
