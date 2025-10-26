import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { isCardBingo } from "@/domains/BingoCard/lib/is-card-bingo";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getCompletedBingoCards(bingoGameId: string) {
	"use cache";
	cacheLife("permanent");
	cacheTag(
		CACHE_TAGS.bingoCards(bingoGameId),
		CACHE_TAGS.lotteryNumber(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

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
