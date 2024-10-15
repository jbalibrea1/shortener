import bcrypt from 'bcrypt';
import { CustomJwtPayload } from '../interfaces/customJwt.interface';
import { IUser } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
import token from '../utils/token';

const register = async ({ user, name, password }: IUser) => {
  const saltRounds = 10;

  const passwordHash: string = await bcrypt.hash(password, saltRounds);

  const userCreated = new UserModel({
    user,
    name,
    passwordHash,
  });

  const savedUser = await userCreated.save();

  const tokenGen = token.generateToken(
    savedUser.user,
    savedUser._id.toString()
  );

  return { token: tokenGen, user: savedUser.user };
};

const getPersonal = async (user: CustomJwtPayload) => {
  if (!user) {
    throw new Error('No user id provided');
  }

  return await UserModel.findById(user.id).populate('shortURLs');
};

const login = async ({ user, password }: IUser) => {
  const userFind = await UserModel.findOne({ user });
  const passwordCorrect =
    userFind === null
      ? false
      : await bcrypt.compare(password, userFind.passwordHash as string);

  if (!(userFind && passwordCorrect)) {
    throw new Error('invalid username or password');
  }

  const tokenGen = token.generateToken(userFind.user, userFind._id.toString());

  return { token: tokenGen, user: userFind.user };
};

export default { register, getPersonal, login };
