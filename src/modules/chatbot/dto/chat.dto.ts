import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AssistantChatDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hello' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  runId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}

export class AssistantChatHistoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  runId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;
}

export class AssistantChatResponse {
  @ApiProperty()
  data: string;
}
