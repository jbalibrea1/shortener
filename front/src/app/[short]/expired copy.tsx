'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

export function ExpiredRedirect() {
  const router = useRouter();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [router]);

  const { data, error, isLoading } = useSWR(
    'http://localhost:8080/api/shorturl',
    fetcher
  );
  if (data) {
    console.log(data);
  }

  if (isLoading) {
    <>CARGANDO</>;
  }
  if (error) {
    <>ERROR</>;
  }
  if (data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No se ha podido encontrar la url acortada, redirigiendo a la página
        principal...
      </div>
    );
  }
}
