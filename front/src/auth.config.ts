import type { NextAuthConfig } from 'next-auth';

const isServer = typeof window === 'undefined';
const baseURL = isServer
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;

export const authConfig = {
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  // TODO: change maxAge
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 días
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          username: user.username,
          name: user.name,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
        };
      }
      if (Date.now() < (token as any).expiresAt * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      }
      // Subsequent logins, but the `access_token` has expired, try to refresh it
      if (!token.refreshToken) throw new TypeError('Missing refreshToken');

      try {
        const res = await fetch(`${baseURL}/auth/refreshToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: token.refreshToken,
          }),
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to refresh token');
        }

        const response = await res.json();
        const newTokens = response.data as {
          accessToken: string;
          expiresIn: number;
          refreshToken?: string;
        };

        return {
          ...token,
          username: token.username,
          name: token.name,
          accessToken: newTokens.accessToken,
          expiresAt: Math.floor(Date.now() / 1000 + newTokens.expiresIn),
          refreshToken: newTokens.refreshToken ?? token.refreshToken,
        };
      } catch (error) {
        console.error('Error refreshing accessToken', error);
        // If we fail to refresh the token, return an error so we can handle it on the page
        return {
          ...token,
          error: 'RefreshTokenError',
        };
      }
    },
    async session({ session, token }: any) {
      if (token.error) {
        session.error = token.error;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  // debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;
