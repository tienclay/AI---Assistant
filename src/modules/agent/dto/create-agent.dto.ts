import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CompanyAgentDto {
  @IsString()
  @ApiProperty({ example: 'Codelight' })
  companyName: string;

  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({})
  prompt?: string;
}
