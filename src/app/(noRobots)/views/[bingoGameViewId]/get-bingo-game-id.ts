import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getBingoGameId(viewId: string) {
	"use cache";

	cacheLife("permanent");

	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { viewId },
		select: { id: true },
	});

	if (!bingoGame) {
		notFound();
	}

	cacheTag(CACHE_TAGS.bingoGameDelete(bingoGame.id));

	return bingoGame.id;
}

export const getBingoGameId = cache(_getBingoGameId);
