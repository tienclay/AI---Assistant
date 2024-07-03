import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssistantHistoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  runId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}
