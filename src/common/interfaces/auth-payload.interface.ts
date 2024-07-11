import { UserRole } from '../enums/user.enum';

export interface AuthPayload {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: UserRole;
}
