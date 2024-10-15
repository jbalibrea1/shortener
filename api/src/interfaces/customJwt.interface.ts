import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  user: string;
  iat: number;
  exp: number;
}
