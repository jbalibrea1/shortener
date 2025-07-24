import axios from 'axios';
import type { NextAuthConfig } from 'next-auth';

const isServer = typeof window === 'undefined';
const baseURL = isServer
  ? process.env.API_URL
  : process.env.NEXT_PUBLIC_API_URL;
const localApi = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
});

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
      console.log(
        `🔑 [authorized] ${new Date().toISOString()} | isLoggedIn=${isLoggedIn}, isOnDashboard=${isOnDashboard}, nextUrl=${
          nextUrl.pathname
        }`
      );
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        console.log(`🔑 [jwt] First-time login for user: ${user.username}`);
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          username: user.username,
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
        const res = await localApi.post('/auth/refreshToken', {
          refreshToken: token.refreshToken,
        });

        const { data } = await res.data;
        const isOk = res.status >= 200 && res.status < 300;
        if (!isOk) throw data;

        const newTokens = data as {
          accessToken: string;
          expiresIn: number;
          refreshToken?: string;
        };

        console.log(
          `🔑 [jwt] New accessToken for user: ${JSON.stringify(newTokens)}`
        );
        return {
          ...token,
          username: token.username,
          accessToken: newTokens.accessToken,
          expiresAt: Math.floor(Date.now() / 1000 + newTokens.expiresIn),
          refreshToken: newTokens.refreshToken
            ? newTokens.refreshToken
            : token.refreshToken,
        };
      } catch (error) {
        console.error('Error refreshing accessToken', error);
        // If we fail to refresh the token, return an error so we can handle it on the page
        token.error = 'RefreshTokenError';
        return token;
      }
    },
    async session({ session, token }: any) {
      console.log(`🔑 [session] Session data: ${JSON.stringify(session)}`);
      console.log(`🔑 [session] Token data: ${JSON.stringify(token)}`);
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      // if (token.accessToken) session.accessToken = token.accessToken;
      // if (token.role) session.user.role = token.role;
      // if (token.username) session.user.username = token.username;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  // debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;
