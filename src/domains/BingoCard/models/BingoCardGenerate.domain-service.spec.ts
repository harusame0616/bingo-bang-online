import { describe, expect, it, vi } from "vitest";

import { InMemoryBingoGameRepository } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.repository";
import { BingoGame } from "@/domains/BingoGame/models/BingoGame";

import type { BingoCardRepository } from "../usecases/BingoCard.repository";
import { BingoCardGenerateDomainService } from "./BingCardGenerate.domain-service";

describe("BingoCardGenerateDomainService", () => {
	describe("execute", async () => {
		const bingoGameRepository = new InMemoryBingoGameRepository();
		const bingoCardRepository = {
			save: vi.fn(),
		} as unknown as BingoCardRepository;
		const _bingoGame = BingoGame.createGame();
		await bingoGameRepository.save(_bingoGame);

		it("対象の BingoGame が存在しないときに例外を投げる", async () => {
			const bingoCardGenerateDomainService = new BingoCardGenerateDomainService(
				{
					bingoCardRepository,
					bingoGameRepository,
				},
			);

			await expect(
				bingoCardGenerateDomainService.execute("not_found"),
			).rejects.toThrow();
		});

		it("カードに名前をつけて作成できる", async () => {
			const bingoCardGenerateDomainService = new BingoCardGenerateDomainService(
				{
					bingoCardRepository,
					bingoGameRepository,
				},
			);

			const name = "bingo-card";
			const { bingoCard } = await bingoCardGenerateDomainService.execute(
				_bingoGame.id,
				{ name },
			);

			expect(bingoCard.name).toBe(name);
		});

		it("カードに名前をつけずに作成すると、名前が空白文字で作成できる", async () => {
			const bingoCardGenerateDomainService = new BingoCardGenerateDomainService(
				{
					bingoCardRepository,
					bingoGameRepository,
				},
			);

			const { bingoCard } = await bingoCardGenerateDomainService.execute(
				_bingoGame.id,
			);

			expect(bingoCard.name).toBe("");
		});
	});
});
