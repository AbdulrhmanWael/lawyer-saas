export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
