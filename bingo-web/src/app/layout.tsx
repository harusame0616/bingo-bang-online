export const dynamic = 'force-dynamic';

import './globals.css';

import { M_PLUS_Rounded_1c, Montserrat } from '@next/font/google';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import Mark from './mark.svg';

export const metadata: Metadata = {
  title: 'BINGOBANG ONLINE',
  description:
    '登録不要、無料で手軽に楽しめるオールインワンのビンゴサービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。',
  robots: 'index, follow',
  applicationName: 'BINGOBANG ONLINE',
  viewport: 'width=device-width,initial-scale=1.0',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: process.env.VERCEL_URL,
    title: 'BINGOBANG ONLINE',
    description:
      '登録不要、無料で手軽に楽しめるビンゴ管理サービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。',
    siteName: 'BINGOBANG ONLINE',
    images: [
      {
        url: `/img/ogp.png`,
        width: 1200,
        height: 630,
        alt: 'BINGOBANG ONLINE',
      },
    ],
  },
};

const titleFont = Montserrat({ subsets: ['latin'], weight: '400' });
const baseFont = M_PLUS_Rounded_1c({ subsets: ['latin'], weight: '400' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full w-full">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${baseFont.className} flex h-full w-full flex-col`}>
        <Header />
        <main className="mt-[48px] grow py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed z-50  flex w-full justify-center bg-background px-4 py-2 shadow-md">
      <Image src={Mark} alt="" width="30" height="30" className="mr-2" />
      <h1 className={`text-2xl ${titleFont.className} text-primary-darken`}>
        <Link href="/">BINGOBANG ONLINE</Link>
      </h1>
    </header>
  );
}

function Footer() {
  return (
    <footer className="grow-0 bg-primary-lighter py-2 text-center font-black text-primary-darken">
      &copy; 2023 Masaharu nemoto
    </footer>
  );
}

function GoogleAnalytics() {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-30177J9MB5"
      />
      <Script id="google-analytics">
        {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-30177J9MB5');
  `}
      </Script>
    </>
  );
}
