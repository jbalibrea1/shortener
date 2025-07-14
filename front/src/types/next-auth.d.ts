import 'next-auth';
//  id: data.username,
//       username: data.username,
//       name: data.name,
//       email: data.email,
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken,
//       expiresAt: Date.now() + data.expiresIn * 1000
declare module 'next-auth' {
  interface User {
    username?: string;
    role?: string;
    // otros campos personalizados si tienes
    id?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
  interface Session {
    user: {
      username?: string;
      role?: string;
      // otros campos personalizados si tienes
    } & DefaultSession['user'];
    accessToken?: string;
    refreshToken?: string;
    expiredAt?: number;
  }
}
