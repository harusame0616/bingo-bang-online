"use server";

import { updateTag } from "next/cache";
import * as v from "valibot";

import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

export async function deleteBingoCardAction(
	bingoGameId: string,
	bingoCardId: string,
) {
	const parsedBingoGameId = v.parse(v.pipe(v.string(), v.uuid()), bingoGameId);
	const parsedBingoCardId = v.parse(v.pipe(v.string(), v.uuid()), bingoCardId);

	// 削除前にbingoGameIdとbingoCardIdの関連性も検証
	await prisma.bingoCardEntity.delete({
		where: {
			id: parsedBingoCardId,
			bingoGameId: parsedBingoGameId,
		},
	});

	updateTag(CACHE_TAGS.bingoCards(parsedBingoGameId));
}
