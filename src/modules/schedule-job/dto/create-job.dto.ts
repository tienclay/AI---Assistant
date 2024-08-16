import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class JobDataDto {
  @IsString()
  chatbotId: string;

  @IsString()
  chatId: string;

  @IsString()
  content: string;
}

export class ScheduleJobDto {
  @IsNumber()
  @ApiProperty({ example: 21600 })
  interval: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isRecurring: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nextExecutionTime: Date;

  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({
    example: { chatbotId: '123', chatId: '123', content: 'Hello' },
  })
  data: JobDataDto;
}
