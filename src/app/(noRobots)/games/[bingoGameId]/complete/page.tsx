import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import { isCardBingo } from "@/domains/BingoCard/lib/is-card-bingo";
import prisma from "@/lib/prisma";

export default async function BingoCardCompletePage({
	params,
}: PageProps<"/games/[bingoGameId]/complete">) {
	const { bingoGameId } = await params;

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
					<BingoCompletionCards bingoGameId={bingoGameId} />
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

async function BingoCompletionCards({ bingoGameId }: { bingoGameId: string }) {
	const completedBingoCards = await getCompletedBingoCards(bingoGameId);

	return (
		<ul
			aria-labelledby="bingo-complete-card-name-list"
			className="list-disc list-inside"
		>
			{completedBingoCards.length
				? completedBingoCards.map((card) => (
						<li key={card.id}>{card.name || "名無しのカード"}</li>
					))
				: "まだ完成済みのビンゴカードはありません"}
		</ul>
	);
}
