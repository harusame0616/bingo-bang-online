import { notFound } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";

async function _getViewId(bingoGameId: string) {
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
