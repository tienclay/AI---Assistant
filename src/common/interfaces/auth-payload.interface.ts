import { UserRole, UserStatus } from '../enums/user.enum';

export interface AuthPayload {
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
}
