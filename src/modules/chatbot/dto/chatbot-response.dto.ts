import { User } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Instruction, Persona } from 'src/common/enums';
import { AuthPayloadDto } from 'src/modules/auth/dto';

export class ChatbotResponse {
  @ApiProperty({ example: 'Codelight' })
  title: string;

  @ApiProperty({ example: 'This assistant will help you with your queries' })
  description: string;

  @ApiProperty()
  creator: AuthPayloadDto; // Assuming you have a User entity defined
}

export class ChatbotSampleProperty {
  @ApiProperty()
  persona: string[];

  @ApiProperty()
  instructions: string[];
}
