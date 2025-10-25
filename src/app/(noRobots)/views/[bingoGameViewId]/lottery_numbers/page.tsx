import { Pacifico } from "next/font/google";
import { Suspense } from "react";

import { Heading } from "@/app/(noRobots)/_components/Heading";
import {
	LotteryHistory,
	LotteryHistorySkeleton,
} from "@/app/(noRobots)/_components/LotteryHistory";
import { Section } from "@/components/BoxSection";
import { Button } from "@/components/Button";
import { getQuery } from "@/lib/infra/getQuery";
import { cn } from "@/lib/utils";

const numberFont = Pacifico({ subsets: ["latin"], weight: "400" });

async function getLotteryNumbers(bingoGameViewId: string) {
	const repository = getQuery("bingoGame");

	const { lotteryNumbers } =
		await repository.findOneByViewIdWithCards(bingoGameViewId);

	return lotteryNumbers;
}

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
	const resolvedBingoGameViewId = await bingoGameViewId;
	const lotteryNumbers = await getLotteryNumbers(resolvedBingoGameViewId);
	const lastNumber = lotteryNumbers.slice(-1)[0] ?? "-";

	return <LastLotteryNumber lotteryNumber={lastNumber} />;
}

async function LotteryHistoryContainer({
	bingoGameViewId,
}: {
	bingoGameViewId: Promise<string>;
}) {
	const resolvedBingoGameViewId = await bingoGameViewId;
	const lotteryNumbers = await getLotteryNumbers(resolvedBingoGameViewId);

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
