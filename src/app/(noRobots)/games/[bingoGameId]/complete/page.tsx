import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import { isCardBingo } from "@/domains/BingoCard/lib/is-card-bingo";
import prisma from "@/lib/prisma";

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

async function getCompletedBingoCards(bingoGameId: string) {
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: {
			id: bingoGameId,
		},
		include: {
			bingoCards: true,
		},
	});

	if (!bingoGame) {
		notFound();
	}

	const completedBingoCards = bingoGame.bingoCards
		.filter((bingoCard) =>
			isCardBingo(bingoGame.lotteryNumbers, bingoCard.squares),
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	return completedBingoCards;
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
	bingoGameId,
}: {
	bingoGameId: Promise<string>;
}) {
	const resolvedBingoGameId = await bingoGameId;
	const completedBingoCards = await getCompletedBingoCards(resolvedBingoGameId);

	return (
		<BingoCompletionCardsPresenter completedBingoCards={completedBingoCards} />
	);
}
