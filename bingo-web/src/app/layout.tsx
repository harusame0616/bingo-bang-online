import './globals.css';

import { M_PLUS_1, Rowdies } from '@next/font/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const titleFont = Rowdies({ subsets: ['latin'], weight: '400' });
const baseFont = M_PLUS_1({ subsets: ['latin-ext'], weight: '600' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <title>BINGOBANG ONLINE</title>
      </head>
      <body className={`${baseFont.className} h-full w-full flex flex-col`}>
        <header className="flex justify-center py-12 px-4 border-b-white border-b-4 grow-0 bg-primary-lighter text-white">
          <h1 className={`text-5xl ${titleFont.className}`}>
            <Link href="/">BINGOBANG ONLINE</Link>
          </h1>
        </header>
        <main className="py-8 px-2 grow items-stretch">{children}</main>
      </body>
    </html>
  );
}
