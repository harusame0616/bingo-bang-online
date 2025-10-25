import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";

async function _getLotteryNumbers(bingoGameId: string) {
	cacheTag(`${bingoGameId}-lottery-number`);

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
