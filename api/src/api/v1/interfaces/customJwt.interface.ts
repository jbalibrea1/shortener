import type { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  username: string;
  role?: string;
  iat: number;
  exp: number;
}
