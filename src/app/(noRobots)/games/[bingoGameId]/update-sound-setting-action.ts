"use server";

import { revalidatePath } from "next/cache";
import * as v from "valibot";
import prisma from "@/lib/prisma";
import { fail, succeed } from "@/lib/result";

const updateSoundSettingParamsSchema = v.object({
	bingoGameId: v.pipe(v.string(), v.uuid()),
	sound: v.boolean(),
});

export async function updateSoundSettingAction(
	params: v.InferOutput<typeof updateSoundSettingParamsSchema>,
) {
	try {
		const parsedParamsResult = v.safeParse(
			updateSoundSettingParamsSchema,
			params,
		);

		if (!parsedParamsResult.success) {
			return fail("パラメーターが不正です");
		}

		const { bingoGameId, sound } = parsedParamsResult.output;

		await prisma.bingoGameEntity.update({
			where: { id: bingoGameId },
			data: { sound },
		});

		revalidatePath(`/games/${bingoGameId}`, "page");

		return succeed();
	} catch (error) {
		if (error instanceof v.ValiError) {
			return fail("入力値が不正です");
		}
		return fail("サウンド設定の更新に失敗しました");
	}
}
