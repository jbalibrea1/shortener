'use client';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function LogoutLink({ className }: { className?: string }) {
  const { toast } = useToast();
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        toast({
          title: 'Logged out',
          description: 'You have been logged out successfully.'
        });
        await signOut({ redirect: false });
        router.push('/');
      }}
    >
      logout
    </button>
  );
}
