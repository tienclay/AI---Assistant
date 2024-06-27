import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCompanyAgentDto {
  @IsString()
  @ApiProperty({ example: 'Codelight' })
  companyName: string;

  @IsUUID()
  @ApiProperty()
  userId: string;
}
