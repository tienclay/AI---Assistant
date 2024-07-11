import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class OtpDataDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  submissionRemaining?: number;
}
