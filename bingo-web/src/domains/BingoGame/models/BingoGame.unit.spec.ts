import { BingoGame } from "./BingoGame";
import { describe, expect, it } from "vitest";

const CREATED = "created";
describe("BingoGame", () => {
  describe("createGame", () => {
    it("ビンゴゲームを作成できる", () => {
      const bingoGame = BingoGame.createGame();

      expect(bingoGame.toDto()).toEqual({
        id: expect.any(String),
        lotteryNumbers: [],
        viewId: expect.any(String),
        hashedManagementPassword: null,
        state: CREATED,
        bingoCardIds: [],
      });
    });
  });

  describe("drawLotteryNumber", () => {
    it("抽選番号が重複しない", () => {
      const bingoGame = BingoGame.createGame();

      [...new Array(75)].forEach(() => {
        bingoGame.drawLotteryNumber();
      });

      const set = new Set(bingoGame.lotteryNumbers);
      expect(set.size).toBe(75);
    });

    it("抽選番号が 1-75 の間", () => {
      const bingoGame = BingoGame.createGame();

      [...new Array(75)].forEach(() => {
        bingoGame.drawLotteryNumber();
      });

      expect(
        bingoGame.lotteryNumbers.every(
          (lotteryNumber) => lotteryNumber > 0 && lotteryNumber <= 75
        )
      ).toBe(true);
    });

    it("75回抽選ができる", () => {
      const bingoGame = BingoGame.createGame();

      [...new Array(75)].forEach(() => {
        bingoGame.drawLotteryNumber();
      });

      expect(bingoGame.lotteryNumbers.length).toBe(75);
    });

    it("76回抽選するとエラーが出る", () => {
      const bingoGame = BingoGame.createGame();

      [...new Array(75)].forEach(() => {
        bingoGame.drawLotteryNumber();
      });

      expect(() => bingoGame.drawLotteryNumber()).toThrow();
    });
  });

  describe("registerBingoCard", () => {
    const CARD_MAX_COUNT = 15;
    it(`ビンゴカードを ${CARD_MAX_COUNT} 枚まで登録できる`, () => {
      const bingoGame = BingoGame.createGame();

      const ids = [...new Array(CARD_MAX_COUNT)].map((_, i) => `${i}`);
      ids.map((id) => {
        bingoGame.registerBingoCard(id);
      });

      expect(bingoGame.bingoCardIds).toEqual(ids);
    });

    it(`ビンゴカードを ${CARD_MAX_COUNT} 枚以上登録しようとするとエラーを返す`, () => {
      const bingoGame = BingoGame.createGame();

      const ids = [...new Array(CARD_MAX_COUNT)].map((_, i) => `${i}`);

      ids.map((id) => {
        bingoGame.registerBingoCard(id);
      });

      expect(() =>
        bingoGame.registerBingoCard(`${CARD_MAX_COUNT + 1}`)
      ).toThrow();
    });

    it("同じ ID のビンゴカードは登録しない", () => {
      const bingoGame = BingoGame.createGame();

      const ids = [...new Array(CARD_MAX_COUNT)].map((_, i) => `${i}`);
      ids.map((id) => {
        bingoGame.registerBingoCard(id);
      });

      bingoGame.registerBingoCard("0");

      expect(bingoGame.bingoCardIds).toEqual(ids);
    });
  });
});
