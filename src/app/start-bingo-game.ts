"use server";

import { BingoGameCreateUsecase } from "@/domains/BingoGame/usecases/BingoGameCreate.usecase";
import { getRepository } from "@/lib/infra/getRepository";
import { fail, succeed } from "@harusame0616/result";
import type { ServerActionResult } from "@/lib/server-action-result";

// VERCEL でレートリミットを設定済み
export async function startBingoGame(): Promise<
	ServerActionResult<{ bingoGameId: string }>
> {
	try {
		const createUsecase = new BingoGameCreateUsecase(
			getRepository("bingoGame"),
		);
		const bingoGame = await createUsecase.execute();
		return succeed({ bingoGameId: bingoGame.id });
	} catch (e) {
		console.error(e);

		return fail(
			"ビンゴゲーム作成に失敗しました。お手数ですが時間をおいて再度お試しください",
		);
	}
}
