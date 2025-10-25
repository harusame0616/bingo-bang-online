import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getSoundSetting(bingoGameId: string) {
	cacheTag(CACHE_TAGS.soundSetting(bingoGameId));

	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: {
			id: bingoGameId,
		},
		select: {
			sound: true,
		},
	});
	if (!bingoGame) {
		notFound();
	}

	return bingoGame.sound;
}

export const getSoundSetting = cache(_getSoundSetting);
