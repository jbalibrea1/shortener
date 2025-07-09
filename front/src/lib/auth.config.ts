export const authConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.token) {
        token.apiToken = user.token;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.apiToken) {
        session.apiToken = token.apiToken;
        session.user.role = token.role;
        session.user.username = token.username;
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
