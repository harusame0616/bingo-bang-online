import { beforeEach, describe, expect, it, vi } from "vitest";
import { BingoGameCreateUsecase } from "./BingoGameCreate.usecase";
import { BingoGameRepository } from "./BingoGameRepository";

const mockBingoGameRepository = {
  save: vi.fn(),
};

describe("BingoGame", () => {
  describe("createGame", () => {
    beforeEach(() => {
      mockBingoGameRepository.save.mockReset();
    });

    it("ビンゴゲームを作成して返す", async () => {
      const bingoGameCreateUsecase = new BingoGameCreateUsecase(
        mockBingoGameRepository as unknown as BingoGameRepository
      );

      const bingoGame = await bingoGameCreateUsecase.execute();

      const CREATED = 0;
      expect(bingoGame).toEqual({
        id: expect.any(String),
        lotteryNumbers: [],
        viewId: expect.any(String),
        state: CREATED,
      });

      // hashedMaganementPassword は返さない
      expect(bingoGame).not.toHaveProperty("hashedManagementPassword");
    });
  });
});
