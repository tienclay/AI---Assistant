import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  MinLength,
} from 'class-validator';

import { otpConfig } from 'src/config/otp.config';
import { OtpDataDto } from 'src/modules/otp-cache/dtos/otp-data.dto';

@Exclude()
export class OtpDto {
  @Expose()
  @IsNotEmpty()
  @MinLength(otpConfig.otp_length)
  @MaxLength(otpConfig.otp_length)
  @ApiProperty({ example: '1234' })
  otp: OtpDataDto;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ example: '300' })
  expireTime: number;

  submissionRemaining?: number;
}
