import { BingoGame } from '../models/BingoGame';

export interface BingoGameRepository {
  findOneById: (bingoGameId: string) => Promise<BingoGame | null>;
  save: (bingoGame: BingoGame) => Promise<void>;
}
