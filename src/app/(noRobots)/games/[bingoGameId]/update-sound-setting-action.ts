"use server";

import { fail, succeed } from "@harusame0616/result";
import { updateTag } from "next/cache";
import * as v from "valibot";
import prisma from "@/lib/prisma";

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

		updateTag(`${bingoGameId}-sound-setting`);

		return succeed();
	} catch (error) {
		if (error instanceof v.ValiError) {
			return fail("入力値が不正です");
		}
		return fail("サウンド設定の更新に失敗しました");
	}
}
