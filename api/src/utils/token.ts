import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../interfaces/customJwt.interface';

const generateToken = (user: string, id: string) => {
  if (!process.env.SECRET) {
    throw new Error('No secret provided');
  }

  const userForToken = {
    user,
    id,
  };

  return jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7, // 1 semana
  });
};

const extractToken = (req: Request) => {
  if (!process.env.SECRET) {
    throw new Error('No secret provided');
  }
  console.log(process.env.SECRET);
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET
    ) as CustomJwtPayload;
    if (!decodedToken.id && typeof decodedToken.id !== 'string') {
      return null;
    }
    console.log('Decoded token: ', decodedToken);
    return decodedToken;
  }
  return null;
};

export default { extractToken, generateToken };
