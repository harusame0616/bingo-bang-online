import { describe, expect, it, vi } from "vitest";
import { BingoCardRepository } from "../usecases/BingoCard.repository";
import { BingoCardGenerateDomainService } from "./BingCardGenerate.domain-service";
import { InMemoryGameRepository } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.repository";
import { BingoGame } from "@/domains/BingoGame/models/BingoGame";

describe("BingoCardGenerateDomainService", () => {
  describe("execute", async () => {
    const bingoGameRepository = new InMemoryGameRepository();
    const bingoCardRepository = {
      save: vi.fn(),
    } as unknown as BingoCardRepository;
    const _bingoGame = BingoGame.createGame();
    await bingoGameRepository.save(_bingoGame);

    it("生成した Bingo Card の ID が BingoGame に登録されている", async () => {
      const bingoCardGenerateDomainService = new BingoCardGenerateDomainService(
        {
          bingoCardRepository,
          bingoGameRepository,
        }
      );

      const { bingoCard, bingoGame } =
        await bingoCardGenerateDomainService.execute({
          bingoGameId: _bingoGame.id,
        });

      expect(bingoGame.bingoCardIds.some((id) => id === bingoCard.id)).toBe(
        true
      );
    });

    it("対象の BingoGame が存在しないときに例外を投げる", async () => {
      const bingoCardGenerateDomainService = new BingoCardGenerateDomainService(
        {
          bingoCardRepository,
          bingoGameRepository,
        }
      );

      await expect(
        bingoCardGenerateDomainService.execute({
          bingoGameId: "not_found",
        })
      ).rejects.toThrow();
    });
  });
});
