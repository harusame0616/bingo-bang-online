import "./globals.css";

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { M_PLUS_Rounded_1c, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import Mark from "./mark.svg";

export const metadata: Metadata = {
	title: "BINGO BANG ONLINE",
	description:
		"登録不要、無料で手軽に楽しめるオールインワンのビンゴサービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。",
	robots: "index, follow",
	applicationName: "BINGO BANG ONLINE",
	viewport: "width=device-width,initial-scale=1.0",
	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: process.env.VERCEL_URL,
		title: "BINGO BANG ONLINE",
		description:
			"登録不要、無料で手軽に楽しめるビンゴ管理サービスです。ビンゴカードの自動生成、番号の抽選、ビンゴチェック、ビンゴしたカード一覧など管理の手間を省きます。ユーザー向けにビンゴカード一覧・ビンゴカード詳細ページ、抽選番号履歴ページもあり、配布や確認も簡単です。",
		siteName: "BINGO BANG ONLINE",
		images: [
			{
				url: `/img/ogp.png`,
				width: 1200,
				height: 630,
				alt: "BINGO BANG ONLINE",
			},
		],
	},
};

const titleFont = Montserrat({ subsets: ["latin"], weight: "400" });
const baseFont = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body
				className={`${baseFont.className} flex h-[100dvh] flex-col overflow-hidden`}
			>
				<header className="relative z-10 flex justify-center bg-background px-4 py-2 shadow-md">
					<Image src={Mark} alt="" width="30" height="30" className="mr-2" />
					<h1 className={`text-2xl ${titleFont.className} text-primary-darken`}>
						<Link href="/">BINGO BANG ONLINE</Link>
					</h1>
				</header>
				<main className="flex grow flex-col overflow-y-hidden">{children}</main>
			</body>
			<GoogleAnalytics gaId="G-30177J9MB5" />
		</html>
	);
}
