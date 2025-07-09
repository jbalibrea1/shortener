export interface IUser {
  id?: string;
  username: string;
  password: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}
