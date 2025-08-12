export interface IUser {
  id?: string;
  username: string;
  password: string;
  passwordHash?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}
