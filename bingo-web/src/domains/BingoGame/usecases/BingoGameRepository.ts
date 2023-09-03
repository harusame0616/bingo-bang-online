import { BingoGame } from "../models/BingoGame";

export type BingoGameRepository = {
  findOneById: (bingoGameId: string) => Promise<BingoGame | null>;
  save: (bingoGame: BingoGame) => Promise<void>;
};
