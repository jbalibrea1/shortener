import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'User', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password
              })
            }
          );

          console.log('Response status:', res.status);

          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          if (data && data.token && data.username) {
            return {
              id: data.username,
              name: data.username,
              token: data.token
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user?.token) {
        token.apiToken = user.token;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token.apiToken) {
        session.apiToken = token.apiToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/signout'
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
