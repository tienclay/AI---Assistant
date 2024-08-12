import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class improveContentDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  prompt: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}

export class improveContentResponse {
  @ApiProperty()
  data: string;
}
