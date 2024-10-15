// app/[short]/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ShortUrlData {
  url: string;
}

export default function ShortPage({ params }: { params: { short: string } }) {
  const router = useRouter();
  const slug = params.short;
  const BACKEND_API = `http://localhost:8080/api/redirect/${slug}`;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(BACKEND_API);
        if (!res.ok) {
          throw new Error('No se pudo redirigir a la URL');
        }
        const data: ShortUrlData = await res.json();
        console.log(data);
        if (data.url) {
          router.push(data.url);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
        setTimeout(() => {
          router.push('/');
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_API, router]);

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
      {error && (
        <div className="scroll-m-20 text-xl md:text-2xl font-extrabold tracking-tight ">
          <p>La url acortada no existe o no se ha encontrado.</p>
          <p>Redirigiendo a la página principal...</p>
        </div>
      )}
    </div>
  );
}
