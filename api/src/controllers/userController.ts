import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';
import auth from '../services/auth.service';
import handleError from '../utils/handleError';
import token from '../utils/token';

const login = async (req: Request<unknown, unknown, IUser>, res: Response) => {
  try {
    const { user, password } = req.body;
    const userAuth = await auth.login({ user, password });
    res.status(200).json({ token: userAuth.token, user: userAuth.user });
  } catch (error) {
    handleError(res, 'Failed to login.', error);
  }
};

const saveUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response
) => {
  try {
    const { user, name, password } = req.body;
    const savedUser = await auth.register({ user, name, password });
    res.status(201).json(savedUser);
  } catch (error) {
    handleError(res, 'Failed to save user.', error);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = token.extractToken(req);
    if (!user) {
      throw new Error('Unauthorized');
    }
    const userUrls = await auth.getPersonal(user);
    res.json(userUrls);
  } catch (error) {
    handleError(res, 'Failed to get user.', error);
  }
};

export default { saveUser, getUser, login };
