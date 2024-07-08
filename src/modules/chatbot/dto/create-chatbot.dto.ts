import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateChatbotDto {
  @IsString()
  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Codelight' })
  title: string;

  @IsString()
  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'This assistant will help you with your queries' })
  description: string;
}
