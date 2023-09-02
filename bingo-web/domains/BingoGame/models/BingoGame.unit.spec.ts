import { BingoGame } from "./BingoGame";
import { describe, expect, it } from "vitest";

describe("BingoGame", () => {
  describe("createGame", () => {
    it("ビンゴゲームを作成できる", () => {
      const bingoGame = BingoGame.createGame();

      const CREATED = 0;
      expect(bingoGame.toDto()).toEqual({
        id: expect.any(String),
        lotteryNumbers: [],
        viewId: expect.any(String),
        hashedManagementPassword: null,
        state: CREATED,
      });
    });
  });
});
