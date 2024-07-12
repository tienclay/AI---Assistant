import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateAssistantRun {
  @IsString()
  @ApiProperty({ example: 'user1' })
  userId: string;
}

export class CreateAssistantRunResponse {
  @ApiProperty()
  @Expose()
  run_id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  chatHistory: string[];
}
