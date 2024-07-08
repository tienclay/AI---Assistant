import { ApiProperty } from '@nestjs/swagger';

export class ChatbotPersonaDto {
  @ApiProperty({ example: 'Codelight' })
  title: string;

  @ApiProperty({ example: 'This assistant will help you with your queries' })
  description: string;
}

export class ChatbotPromptDto {
  @ApiProperty({ example: 'Codelight' })
  title: string;

  @ApiProperty({ example: 'This assistant will help you with your queries' })
  description: string;
}
