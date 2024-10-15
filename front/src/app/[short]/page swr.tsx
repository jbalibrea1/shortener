// app/[short]/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

interface ShortUrlData {
  url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShortPage({ params }: { params: { short: string } }) {
  const router = useRouter();
  const slug = params.short;
  const BACKEND_API = `http://localhost:8080/api/redirect/${slug}`;

  const { data, error, isLoading } = useSWR<ShortUrlData>(BACKEND_API, fetcher);

  useEffect(() => {
    if (data && data.url) {
      const { url } = data;
      router.push(url);
    } else {
      const timer = setTimeout(() => {
        console.log('entrando al timer');
        router.push('/');
      }, 50000);
      return () => clearTimeout(timer);
    }
  }, [data, error, router]);

  // Manejo de estados
  if (isLoading) {
    return (
      <div className="flex flex-1 w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl flex flex-1 flex-col items-center justify-center">
      {(!data?.url || error) && (
        <div className="scroll-m-20 text-xl md:text-2xl font-extrabold tracking-tight ">
          <p>La url acortada no existe o no se ha encontrado.</p>
          <p>Redirigiendo a la página principal...</p>
        </div>
      )}
    </div>
  );
}
