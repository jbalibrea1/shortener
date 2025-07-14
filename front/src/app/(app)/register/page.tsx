import { RegisterForm } from '@/components/register-form';
import { redirect } from 'next/navigation';
import { auth } from '../../../auth';

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="container w-full h-full flex-1 flex min-h-[calc(85vh)] items-center justify-center">
      <RegisterForm />
    </main>
  );
}
