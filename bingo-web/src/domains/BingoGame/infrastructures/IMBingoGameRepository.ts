import { BingoGame, BingoGameDto } from "../models/BingoGame";
import { BingoGameRepository } from "../usecases/BingoGameRepository";

const store = new Map<string, BingoGameDto>();

export class InMemoryGameRepository implements BingoGameRepository {
  async findOneById(bingoGameId: string): Promise<BingoGame> {
    const bingoGame = store.get(bingoGameId);
    if (!bingoGame) {
      throw new Error("ビンゴゲームが見つかりません");
    }

    return BingoGame.fromDto(bingoGame);
  }

  async save(bingoGame: BingoGame): Promise<void> {
    store.set(bingoGame.id, bingoGame.toDto());
  }
}
