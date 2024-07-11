import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Instruction, Persona } from 'src/common/enums';
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

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsEnum(Persona, { each: true })
  persona: Persona[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  prompt: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsEnum(Instruction, { each: true })
  instruction: Instruction[];
}
