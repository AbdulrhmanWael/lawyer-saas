import { Role } from 'src/roles/role.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: Role;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
