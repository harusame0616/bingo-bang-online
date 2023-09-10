import { BingoCard, BingoCardDto } from "../../models/BingoCard";
import { BingoCardRepository } from "../../usecases/BingoCard.repository";

const store = new Map<string, BingoCardDto>();

export class InMemoryBingoCardRepository implements BingoCardRepository {
  async save(bingoCard: BingoCard): Promise<void> {
    store.set(bingoCard.id, bingoCard.toDto());
  }
}
