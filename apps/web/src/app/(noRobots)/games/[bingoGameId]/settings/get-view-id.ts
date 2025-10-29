import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

async function _getViewId(bingoGameId: string) {
	"use cache";
	cacheLife("permanent");
	cacheTag(CACHE_TAGS.bingoGameDelete(bingoGameId));

	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { id: bingoGameId },
		select: { viewId: true },
	});

	if (!bingoGame) {
		notFound();
	}

	return bingoGame.viewId;
}

export const getViewId = cache(_getViewId);
