"use server";

import { fail, succeed } from "@harusame0616/result";
import { updateTag } from "next/cache";
import * as v from "valibot";
import { BingoCardGenerateUsecase } from "@/domains/BingoCard/usecases/BingoCardGenerate.usecase";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getRepository } from "@/lib/infra/getRepository";

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

	updateTag(CACHE_TAGS.bingoCards(parsedParamsResult.output.bingoGameId));

	return succeed();
}
