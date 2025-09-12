import { UserRole } from '../user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
