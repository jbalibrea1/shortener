import { redirect } from 'next/navigation';
import { ExpiredRedirect } from './page';

interface Params {
  short: string;
}

export default async function Short({ params }: { params: Params }) {
  const slug = params.short;
  const BACKEND_API = `http://localhost:8080/api/redirect/${slug}`;

  const res = await fetch(BACKEND_API);
  if (res.ok) {
    const { url } = await res.json();
    redirect(url);
  }

  return <ExpiredRedirect />;
}
