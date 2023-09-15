import { BingoCard } from '../models/BingoCard';

export interface BingoCardRepository {
  save: (bingoGame: BingoCard) => Promise<void>;
  delete: (bingoCardId: string) => Promise<void>;
}
