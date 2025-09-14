import { describe, expect, it } from "vitest";

import { BingoGame } from "./BingoGame";

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
					(lotteryNumber) => lotteryNumber > 0 && lotteryNumber <= 75,
				),
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
});
