import { Request } from 'express';

export default interface AuthRequest extends Request {
  user?: {
    id: string;
    role: { name: string; permissions: { name: string }[] }; // permissions from DB
  };
}
