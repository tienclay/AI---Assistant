import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty({ example: 'Bearer ...' })
  accessToken: string;
}
