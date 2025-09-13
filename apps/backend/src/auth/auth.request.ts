import { Request } from 'express';
import { Permission } from './permissions.type';

export default interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: Permission[];
  };
}
