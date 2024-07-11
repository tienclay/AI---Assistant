import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @ApiProperty({ example: 'thanhvo@codelight.co' })
  email: string;

  @IsString()
  @ApiProperty({ example: 1234 })
  otp: string;
}
