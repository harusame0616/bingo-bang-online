import { ReloadIcon } from "@radix-ui/react-icons";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import { CACHE_TAGS } from "@/lib/cache-tags";

import { getCompletedBingoCards } from "./get-completed-bingo-cards";

export default function BingoCardCompletePage({
	params,
}: PageProps<"/games/[bingoGameId]/complete">) {
	const bingoGameId = params.then(({ bingoGameId }) => bingoGameId);

	return (
		<div>
			<Heading>ビンゴ完成カードリスト</Heading>
			<Suspense
				fallback={
					<div className="flex justify-center">
						<ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
					</div>
				}
			>
				<div className="flex justify-center mt-4">
					<BingoCompletionCardsContainer bingoGameId={bingoGameId} />
				</div>
			</Suspense>
		</div>
	);
}

type BingoCompletionCardsPresenterProps = {
	completedBingoCards: Array<{
		id: string;
		name: string;
	}>;
};

function BingoCompletionCardsPresenter({
	completedBingoCards,
}: BingoCompletionCardsPresenterProps) {
	if (completedBingoCards.length === 0) {
		return <div>まだ完成済みのビンゴカードはありません</div>;
	}

	return (
		<ul
			aria-labelledby="bingo-complete-card-name-list"
			className="list-disc list-inside"
		>
			{completedBingoCards.map((card) => (
				<li key={card.id}>{card.name || "名無しのカード"}</li>
			))}
		</ul>
	);
}

async function BingoCompletionCardsContainer({
	bingoGameId: bingoGameIdPromise,
}: {
	bingoGameId: Promise<string>;
}) {
	"use cache";

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(
		CACHE_TAGS.bingoCards(bingoGameId),
		CACHE_TAGS.lotteryNumber(bingoGameId),
	);

	const completedBingoCards = await getCompletedBingoCards(bingoGameId);

	return (
		<BingoCompletionCardsPresenter completedBingoCards={completedBingoCards} />
	);
}
