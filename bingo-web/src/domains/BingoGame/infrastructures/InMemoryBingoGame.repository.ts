import { BingoGame, BingoGameDto } from "../models/BingoGame";
import { BingoGameRepository } from "../usecases/BingoGame.repository";

const store = new Map<string, BingoGameDto>();

export class InMemoryGameRepository implements BingoGameRepository {
  async findOneById(bingoGameId: string): Promise<BingoGame | null> {
    const bingoGame = store.get(bingoGameId);
    if (!bingoGame) {
      return null;
    }

    return BingoGame.fromDto(bingoGame);
  }

  async save(bingoGame: BingoGame): Promise<void> {
    store.set(bingoGame.id, bingoGame.toDto());
  }
}
