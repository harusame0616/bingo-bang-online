import { BingoCard } from '../../models/BingoCard';
import { BingoCardRepository } from '../../usecases/BingoCard.repository';
import { bingoCardStore } from './IMBingoCardStore';

export class InMemoryBingoCardRepository implements BingoCardRepository {
  async save(bingoCard: BingoCard): Promise<void> {
    bingoCardStore.set(bingoCard.id, bingoCard.toDto());
  }
}
