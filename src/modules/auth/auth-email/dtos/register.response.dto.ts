import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { EmailRegisterInputDto } from './register.input.dto';

@Exclude()
export class EmailRegisterResponseDto extends EmailRegisterInputDto {
  @Expose()
  @ApiProperty({ example: '0c2e7f94-604e-4ead-baa7-40405185763d' })
  id: string;

  @Expose()
  @ApiProperty({ example: '' })
  sessionId: string;
}
