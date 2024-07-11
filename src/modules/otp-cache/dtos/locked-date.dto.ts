import { IsDateString } from 'class-validator';

export class LockedDateDto {
  @IsDateString()
  lockedDate: Date;
}
