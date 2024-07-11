import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SendOtpResponseDto {
  @Expose()
  @ApiProperty({ example: true })
  isSent: boolean;

  @Expose()
  sessionId: string;

  @Expose()
  @ApiProperty({ example: '300' })
  expireTime: number;

  @Expose()
  @ApiProperty({ example: '60' })
  resendExpireTime: number;
}
