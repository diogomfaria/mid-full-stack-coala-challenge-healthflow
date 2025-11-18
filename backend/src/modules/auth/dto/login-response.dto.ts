import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/users/domain/user-role.enum';

export class LoginResponseDto {
  @ApiProperty({ example: 'jwt.token.aqui' })
  access_token: string;

  @ApiProperty({ example: 'uuid-do-usuario' })
  id: string;

  @ApiProperty({ example: 'attendant@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ATTENDANT })
  role: UserRole;
}
