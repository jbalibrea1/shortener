'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { toast } from 'sonner';

export function LogoutLink({
  className = '',
  children
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`${className} cursor-pointer`}
      onClick={async () => {
        await signOut({ redirect: false });
        toast.success('You have successfully logged out.');
        router.push('/');
      }}
    >
      {children}
    </button>
  );
}
