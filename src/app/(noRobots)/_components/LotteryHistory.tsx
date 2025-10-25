import { notFound } from "next/navigation";

import { Chip } from "@/components/Chip";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";

export async function LotteryHistoryContainer({
	bingoGameId,
}: {
	bingoGameId: Promise<string>;
}) {
	const resolvedBingoGameId = await bingoGameId;

	async function getLotteryNumbers() {
		const bingoGame = await prisma.bingoGameEntity.findUnique({
			where: {
				id: resolvedBingoGameId,
			},
		});
		if (!bingoGame) {
			notFound();
		}

		return bingoGame?.lotteryNumbers;
	}

	const numbers = await getLotteryNumbers();

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
