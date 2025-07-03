'use client';
import { signOut } from 'next-auth/react';

export function LogoutLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      logout
    </button>
  );
}
