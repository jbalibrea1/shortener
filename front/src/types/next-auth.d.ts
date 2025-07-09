import 'next-auth';

declare module 'next-auth' {
  interface User {
    username?: string;
    role?: string;
    // otros campos personalizados si tienes
  }
  interface Session {
    user: {
      username?: string;
      role?: string;
      // otros campos personalizados si tienes
    } & DefaultSession['user'];
    apiToken?: string;
  }
}
