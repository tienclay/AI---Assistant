import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { otpConfig } from 'src/config/otp.config';
import { v4 as uuidv4 } from 'uuid';

@Exclude()
export class LoginDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: uuidv4() })
  sessionId: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(otpConfig.otp_length)
  @MaxLength(otpConfig.otp_length)
  @ApiProperty({ example: '1234' })
  otp: string;
}
