import { cacheLife, cacheTag } from "next/cache";
import { Pacifico } from "next/font/google";
import { Suspense } from "react";

import { Heading } from "@/app/(noRobots)/_components/Heading";
import { getLotteryNumbers } from "@/app/(noRobots)/games/[bingoGameId]/get-lottery-numbers";
import {
	LotteryHistory,
	LotteryHistorySkeleton,
} from "@/app/(noRobots)/games/[bingoGameId]/lottery-history";
import { Section } from "@/components/BoxSection";
import { Button } from "@/components/Button";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { cn } from "@/lib/utils";

import { getBingoGameId } from "../get-bingo-game-id";

const numberFont = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Page({
	params,
}: PageProps<"/views/[bingoGameViewId]/lottery_numbers">) {
	const bingoGameViewId = params.then(({ bingoGameViewId }) => bingoGameViewId);

	return (
		<div>
			<Section>
				<h2 className="mb-2 text-center text-xs text-primary-darken">
					最終抽選番号
				</h2>
				<Suspense fallback={<LastLotteryNumber lotteryNumber="-" />}>
					<LotteryNumberContainer bingoGameViewId={bingoGameViewId} />
				</Suspense>
			</Section>
			<Section>
				<Heading>抽選番号履歴</Heading>
				<Suspense fallback={<LotteryHistorySkeleton />}>
					<LotteryHistoryContainer bingoGameViewId={bingoGameViewId} />
				</Suspense>
			</Section>
		</div>
	);
}

async function LotteryNumberContainer({
	bingoGameViewId,
}: {
	bingoGameViewId: Promise<string>;
}) {
	"use cache";

	cacheLife("permanent");

	const resolvedBingoGameViewId = await bingoGameViewId;
	const bingoGameId = await getBingoGameId(resolvedBingoGameViewId);

	cacheTag(
		CACHE_TAGS.lotteryNumber(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

	const lotteryNumbers = await getLotteryNumbers(bingoGameId);

	const lastNumber = lotteryNumbers.slice(-1)[0] ?? "-";

	return <LastLotteryNumber lotteryNumber={lastNumber} />;
}

async function LotteryHistoryContainer({
	bingoGameViewId,
}: {
	bingoGameViewId: Promise<string>;
}) {
	"use cache";

	cacheLife("permanent");

	const resolvedBingoGameViewId = await bingoGameViewId;
	const bingoGameId = await getBingoGameId(resolvedBingoGameViewId);

	cacheTag(
		CACHE_TAGS.lotteryNumber(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

	const lotteryNumbers = await getLotteryNumbers(bingoGameId);

	return <LotteryHistory lotteryNumbers={lotteryNumbers} />;
}

function LastLotteryNumber({ lotteryNumber }: { lotteryNumber: number | "-" }) {
	return (
		<>
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"-mt-20 text-[10rem] text-primary-darken",
						numberFont.className,
					)}
				>
					{lotteryNumber ?? "-"}
				</div>
			</div>
			<form className="-mt-4 flex justify-center" method="GET">
				<Button>再読み込み</Button>
			</form>
		</>
	);
}
