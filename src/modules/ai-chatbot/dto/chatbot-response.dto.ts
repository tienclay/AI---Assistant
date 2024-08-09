import { ApiProperty } from '@nestjs/swagger';

export class ChatbotSampleProperty {
  @ApiProperty()
  persona: string[];

  @ApiProperty()
  instructions: string[];
}
