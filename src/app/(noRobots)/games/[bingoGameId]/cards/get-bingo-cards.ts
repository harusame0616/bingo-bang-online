import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getBingoCards(bingoGameId: string) {
	cacheTag(CACHE_TAGS.bingoCards(bingoGameId));

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

	return bingoGame.bingoCards || [];
}

export const getBingoCards = cache(_getBingoCards);
