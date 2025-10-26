import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getLotteryNumbers(bingoGameId: string) {
	"use cache";
	cacheLife("permanent");
	cacheTag(
		CACHE_TAGS.lotteryNumber(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: {
			id: bingoGameId,
		},
	});
	if (!bingoGame) {
		notFound();
	}

	return bingoGame.lotteryNumbers;
}

export const getLotteryNumbers = cache(_getLotteryNumbers);
