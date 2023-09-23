import './globals.css';

import { M_PLUS_Rounded_1c, Rowdies } from '@next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BINGOBANG ONLINE',
  description:
    '登録不要、無料で手軽に楽しめるオールインワンのビンゴサービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: process.env.VERCEL_URL,
    title: 'BINGOBANG ONLINE',
    description:
      '登録不要、無料で手軽に楽しめるオールインワンのビンゴサービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。',
    siteName: 'BINGOBANG ONLINE',
    images: [
      {
        url: `${process.env.VERCEL_URL}/img/ogp.png`,
        width: 1200,
        height: 630,
        alt: 'BINGOBANG ONLINE',
      },
    ],
  },
};

const titleFont = Rowdies({ subsets: ['latin'], weight: '400' });
const baseFont = M_PLUS_Rounded_1c({ subsets: ['latin'], weight: '400' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full w-full">
      <body
        className={`${baseFont.className} flex h-full w-full flex-col text-primary-normal`}
      >
        <header className="flex grow-0 justify-center bg-primary-lighter px-4 py-12 text-white">
          <h1 className={`text-5xl ${titleFont.className}`}>
            <Link href="/">BINGOBANG ONLINE</Link>
          </h1>
        </header>
        <main className="grow py-8">{children}</main>
        <footer className="grow-0 bg-primary-lighter py-2 text-center font-black text-primary-darken">
          &copy; 2023 Masaharu nemoto
        </footer>
      </body>
    </html>
  );
}
