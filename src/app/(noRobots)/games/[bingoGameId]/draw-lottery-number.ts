"use server";

import { updateTag } from "next/cache";
import { BingoGameDrawLotteryNumberUsecase } from "@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase";
import { getRepository } from "@/lib/infra/getRepository";

export async function drawLotteryNumberAction(bingoGameId: string) {
	const drawLotteryNumberUsecase = new BingoGameDrawLotteryNumberUsecase(
		getRepository("bingoGame"),
	);

	const bingoGameDto = await drawLotteryNumberUsecase.execute(bingoGameId);
	const lastLotteryNumber = bingoGameDto.lotteryNumbers.at(-1);

	if (lastLotteryNumber === undefined) {
		throw new Error("抽選後の番号を取得できませんでした");
	}

	updateTag(`${bingoGameId}-lottery-number`);

	return lastLotteryNumber;
}
