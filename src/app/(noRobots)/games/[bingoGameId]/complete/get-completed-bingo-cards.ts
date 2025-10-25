import { notFound } from "next/navigation";
import { cache } from "react";
import { isCardBingo } from "@/domains/BingoCard/lib/is-card-bingo";
import prisma from "@/lib/prisma";

async function _getCompletedBingoCards(bingoGameId: string) {
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

export const getCompletedBingoCards = cache(_getCompletedBingoCards);
