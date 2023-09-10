import { BingoGame } from "../models/BingoGame";
import { BingoGameRepository } from "../usecases/BingoGame.repository";
import { bingoGameStore } from "./IMBIngoGameStore";

export class InMemoryGameRepository implements BingoGameRepository {
  async findOneById(bingoGameId: string): Promise<BingoGame | null> {
    const bingoGame = bingoGameStore.get(bingoGameId);
    if (!bingoGame) {
      return null;
    }

    return BingoGame.fromDto(bingoGame);
  }

  async save(bingoGame: BingoGame): Promise<void> {
    bingoGameStore.set(bingoGame.id, bingoGame.toDto());
  }
}
