/**
 * Utility functions for JWT token creation and verification.
 * @module utils/token
 */

import config from '@/config';
import { CustomJwtPayload } from '@/interfaces';
import { UnauthorizedError } from '@/utils/errors';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (username: string, id: string, role: string) => {
  if (!config.jwtSecret) {
    throw new UnauthorizedError('No secret provided');
  }

  const userForToken = { username, id, role };

  return jwt.sign(userForToken, config.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 7 // 1 semana
  });
};

const extractToken = (req: Request<unknown>) => {
  if (!config.jwtSecret) {
    throw new UnauthorizedError('No secret provided');
  }

  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(
      token,
      config.jwtSecret
    ) as CustomJwtPayload;

    if (!decodedToken.id && typeof decodedToken.id !== 'string') {
      return null;
    }

    return decodedToken;
  }
  return null;
};

export default { generateToken, extractToken };
