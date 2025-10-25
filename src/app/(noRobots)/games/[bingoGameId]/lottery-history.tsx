import { cacheTag } from "next/cache";
import { Chip } from "@/components/Chip";
import { Skeleton } from "@/components/ui/skeleton";
import { getLotteryNumbers } from "./get-lottery-numbers";

export async function LotteryHistoryContainer({
	bingoGameId: bingoGameIdPromise,
}: {
	bingoGameId: Promise<string>;
}) {
	"use cache";

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(`${bingoGameId}-lottery-number`);

	const numbers = await getLotteryNumbers(bingoGameId);

	return <LotteryHistory lotteryNumbers={numbers} />;
}

export function LotteryHistory({
	lotteryNumbers,
}: {
	lotteryNumbers: number[];
}) {
	return (
		<ol className="flex flex-wrap justify-center gap-x-2 gap-y-1">
			{lotteryNumbers.map((lotteryNumber) => (
				<li key={lotteryNumber}>
					<Chip>{lotteryNumber}</Chip>
				</li>
			))}
		</ol>
	);
}

export function LotteryHistorySkeleton() {
	return (
		<div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
			{Array.from({ length: 12 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton is a static display, order never changes
				<Skeleton key={index} className="h-6 w-16 rounded-lg" />
			))}
		</div>
	);
}
