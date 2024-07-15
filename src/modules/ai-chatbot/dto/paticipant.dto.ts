import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ParticipantInputDto {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @ApiProperty({ example: '' })
  id: string;
}
