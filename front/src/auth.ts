import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import api from "./lib/axios";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "User", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await api.post("/auth/login", {
            username: credentials?.username,
            password: credentials?.password,
          });
          const { data } = res.data;
          console.log("🔐 Auth response:", data);
          if (data?.accessToken && data.username) {
            return {
              id: data.username,
              username: data.username,
              name: data.name,
              email: data.email,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresAt: data.expiresAt, // Assuming the API returns an expiresAt timestamp
              // expiresAt: Date.now() + data.expiresIn * 1000
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
