"use server";

import { revalidatePath } from "next/cache";
import * as v from "valibot";

import prisma from "@/lib/prisma";

export async function deleteBingoCard(bingoCardId: string) {
	const parsedBingoCardId = v.parse(v.string(), bingoCardId);

	await prisma.bingoCardEntity.delete({
		where: {
			id: parsedBingoCardId,
		},
	});

	revalidatePath("/game/[bingoGameId]");
}
