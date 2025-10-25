"use server";

import { updateTag } from "next/cache";
import * as v from "valibot";

import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

export async function deleteBingoCardAction(
	bingoGameId: string,
	bingoCardId: string,
) {
	const parsedBingoCardId = v.parse(v.string(), bingoCardId);

	await prisma.bingoCardEntity.delete({
		where: {
			id: parsedBingoCardId,
		},
	});

	updateTag(CACHE_TAGS.bingoCards(bingoGameId));
}
