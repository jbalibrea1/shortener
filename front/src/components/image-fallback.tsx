/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Metadata {
  logo?: string;
  title?: string;
}

const ImageFallback: React.FC<{ data: Metadata }> = ({ data }) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = '/favicon.ico';
  };

  return (
    <>
      <img
        src={data.logo ?? '/favicon.ico'}
        alt={data.title}
        className="max-w-10 max-h-10 border-2 border-primary rounded-full"
        onError={handleImageError}
      />
    </>
  );
};

export default ImageFallback;
