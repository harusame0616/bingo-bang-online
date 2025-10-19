import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BingoGameRepository } from "./BingoGame.repository";
import { BingoGameCreateUsecase } from "./BingoGameCreate.usecase";

const mockBingoGameRepository = {
	save: vi.fn(),
};

describe("BingoGameCreateUsecase", () => {
	describe("execute", () => {
		beforeEach(() => {
			mockBingoGameRepository.save.mockReset();
		});

		it("ビンゴゲームを作成して返す", async () => {
			const bingoGameCreateUsecase = new BingoGameCreateUsecase(
				mockBingoGameRepository as unknown as BingoGameRepository,
			);

			const bingoGame = await bingoGameCreateUsecase.execute();

			const CREATED = "created";
			expect(bingoGame).toEqual({
				id: expect.any(String),
				lotteryNumbers: [],
				viewId: expect.any(String),
				state: CREATED,
				bingoCardIds: [],
			});

			expect(bingoGame).not.toHaveProperty("hashedManagementPassword");
		});
	});
});
