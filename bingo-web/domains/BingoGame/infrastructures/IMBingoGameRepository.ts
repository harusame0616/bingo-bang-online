const store = new Map<string, BingoGameDto>();

class InMemoryGameRepository implements BingoGameRepository {
  async save(bingoGame: BingoGame): Promise<void> {
    store.set(bingoGame.id, bingoGame.toDto());
  }
}
