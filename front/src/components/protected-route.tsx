import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Cargando...</div>;

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return children;
}
