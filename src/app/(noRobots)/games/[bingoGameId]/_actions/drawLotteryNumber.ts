"use server";

import { revalidatePath } from "next/cache";

import { BingoGameDrawLotteryNumberUsecase } from "@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase";
import { getRepository } from "@/lib/infra/getRepository";

export async function drawLotteryNumber(bingoGameId: string) {
	const drawLotteryNumberUsecase = new BingoGameDrawLotteryNumberUsecase(
		getRepository("bingoGame"),
	);

	const lotteryNumber = await drawLotteryNumberUsecase.execute(bingoGameId);

	revalidatePath("/game/[bingoGameId]");
	return lotteryNumber.lotteryNumbers.at(-1) as number;
}
