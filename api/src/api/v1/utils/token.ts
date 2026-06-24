/**
 * Utility functions for JWT token creation and verification.
 * @module utils/token
 */

import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import type { CustomJwtPayload } from '@/api/v1/interfaces';
import { UnauthorizedError } from '@/api/v1/utils/errors';
import config from '@/config';

const ACCESS_TOKEN_EXP = config.env === 'production' ? '15m' : '1h';
const REFRESH_TOKEN_EXP = '7d';
const generateToken = (username: string, id: string, role: string) => {
  if (!config.jwtSecret) {
    throw new UnauthorizedError('No secret provided');
  }

  const userForToken = { username, id, role };

  const accessToken = jwt.sign(userForToken, config.jwtSecret, {
    expiresIn: ACCESS_TOKEN_EXP,
  });
  const refreshToken = jwt.sign(userForToken, config.refreshSecret, {
    expiresIn: REFRESH_TOKEN_EXP,
  });
  //TODO: EXPIRED_IN??
  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() + 7); // 7 days for refresh token

  return { accessToken, refreshToken, expiredAt };
};

const extractToken = (req: Request<unknown>) => {
  if (!config.jwtSecret) {
    throw new UnauthorizedError('No secret provided');
  }

  const authorization = req.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(
      token,
      config.jwtSecret,
    ) as CustomJwtPayload;

    console.log("el docededtoken es: ", decodedToken)

    if (!decodedToken.id && typeof decodedToken.id !== 'string') {
      return null;
    }

    return decodedToken;
  }
  return null;
};

const verifyRefreshToken = (token: string): CustomJwtPayload | null => {
  if (!config.refreshSecret) {
    throw new UnauthorizedError('No secret provided');
  }
  const decodedToken = jwt.verify(
    token,
    config.refreshSecret,
  ) as CustomJwtPayload;
  if (!decodedToken.id || typeof decodedToken.id !== 'string') {
    return null;
  }
  return decodedToken;
};

export default { generateToken, extractToken, verifyRefreshToken };
