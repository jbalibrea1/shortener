// middleware.ts
console.log('🔑 [middleware] Initializing NextAuth middleware...');
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (página de inicio de sesión)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)'
  ]
};
