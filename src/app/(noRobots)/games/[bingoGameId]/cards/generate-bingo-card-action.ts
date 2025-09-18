"use server";

import { revalidatePath } from "next/cache";
import * as v from "valibot";

import { BingoCardGenerateUsecase } from "@/domains/BingoCard/usecases/BingoCardGenerate.usecase";
import { getRepository } from "@/lib/infra/getRepository";
import { fail, succeed } from "@/lib/result";

const generateBingoCardParamsSchema = v.object({
	bingoGameId: v.pipe(v.string(), v.uuid()),
	cardName: v.optional(v.string()),
});

export async function generateBingoCardAction(
	params: v.InferOutput<typeof generateBingoCardParamsSchema>,
) {
	const parsedParamsResult = v.safeParse(generateBingoCardParamsSchema, params);

	if (!parsedParamsResult.success) {
		return fail("パラメーターが不正です");
	}

	const bingoCardGenerateUsecase = new BingoCardGenerateUsecase({
		bingoCardRepository: getRepository("bingoCard"),
		bingoGameRepository: getRepository("bingoGame"),
	});

	await bingoCardGenerateUsecase.execute(
		parsedParamsResult.output.bingoGameId,
		{
			name: parsedParamsResult.output.cardName,
		},
	);

	revalidatePath("/game/[bingoGameId]/bing-cards");

	return succeed();
}
