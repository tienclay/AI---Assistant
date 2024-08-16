import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { JobHistoryStatus } from 'src/common/enums';

export class JobExecutionHistoryDto {
  @IsNumber()
  @ApiProperty({ type: String, format: 'uuid' })
  jobId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  executionTime: Date;

  @IsNotEmpty()
  @IsEnum(JobHistoryStatus)
  @ApiProperty()
  status: JobHistoryStatus;
}
