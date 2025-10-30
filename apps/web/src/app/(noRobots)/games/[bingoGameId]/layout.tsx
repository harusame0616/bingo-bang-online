import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import BingoCardIcon from "./_img/bingo-card.svg";
import CompleteIcon from "./_img/complete.svg";
import LotteryIcon from "./_img/lottery.svg";
import SettingIcon from "./_img/setting.svg";

export default async function Layout({
	children,
	params,
}: LayoutProps<"/games/[bingoGameId]">) {
	const bingoGameId = params.then((params) => params.bingoGameId);

	return (
		<div className="flex grow flex-col overflow-y-hidden">
			<div className="grow overflow-y-auto p-4 [scrollbar-gutter:stable]">
				{children}
			</div>
			<nav className="bottom-0 flex w-full justify-center border-t">
				<Suspense fallback={<GameMenuSkeleton />}>
					<GameMenuContainer bingoGameId={bingoGameId} />
				</Suspense>
			</nav>
		</div>
	);
}

function GameMenuSkeleton() {
	const menuConfig = [
		{ label: "抽選", icon: LotteryIcon },
		{ label: "カード管理", icon: BingoCardIcon },
		{ label: "完成リスト", icon: CompleteIcon },
		{ label: "設定", icon: SettingIcon },
	];

	return (
		<ul className="flex gap-8 py-4">
			{menuConfig.map(({ icon, label }) => (
				<li className="flex items-center justify-center" key={label}>
					<div className="flex flex-col items-center justify-center gap-1">
						<div className="relative h-8 w-8">
							<Image src={icon} alt="" fill />
						</div>
						{label}
					</div>
				</li>
			))}
		</ul>
	);
}

async function GameMenuContainer({
	bingoGameId,
}: {
	bingoGameId: Promise<string>;
}) {
	const resolvedBingoGameId = await bingoGameId;

	const menuItems = [
		{
			path: `/games/${resolvedBingoGameId}`,
			label: "抽選",
			icon: LotteryIcon,
		},
		{
			path: `/games/${resolvedBingoGameId}/cards`,
			label: "カード管理",
			icon: BingoCardIcon,
		},
		{
			path: `/games/${resolvedBingoGameId}/complete`,
			label: "完成リスト",
			icon: CompleteIcon,
		},
		{
			path: `/games/${resolvedBingoGameId}/settings`,
			label: "設定",
			icon: SettingIcon,
		},
	];

	return <GameMenuPresenter menuItems={menuItems} />;
}

function GameMenuPresenter({
	menuItems,
}: {
	menuItems: Array<{
		path: string;
		label: string;
		icon: string;
	}>;
}) {
	return (
		<ul className="flex gap-8 py-4">
			{menuItems.map(({ icon, label, path }) => (
				<li className="flex items-center justify-center" key={path}>
					<Link
						href={path}
						className="flex flex-col items-center justify-center gap-1"
					>
						<div className="relative h-8 w-8">
							<Image src={icon} alt="" fill />
						</div>
						{label}
					</Link>
				</li>
			))}
		</ul>
	);
}
