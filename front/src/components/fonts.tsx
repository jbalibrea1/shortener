import { GeistSans } from 'geist/font/sans';
import { Inter, Roboto } from 'next/font/google';

export const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const fontSans = GeistSans;
