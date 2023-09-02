import { BingoGame, BingoGameDto } from "../models/BingoGame";

const store = new Map<string, BingoGameDto>();

export class InMemoryGameRepository implements BingoGameRepository {
  async save(bingoGame: BingoGame): Promise<void> {
    store.set(bingoGame.id, bingoGame.toDto());
  }
}
