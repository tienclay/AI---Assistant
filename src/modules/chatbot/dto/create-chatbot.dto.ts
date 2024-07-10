import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateChatbotDto {
  @IsString()
  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Codelight' })
  name: string;

  @IsString()
  @Column({ type: 'varchar' })
  @IsOptional()
  @ApiProperty({ example: 'This assistant will help you with your queries' })
  description: string;
}
