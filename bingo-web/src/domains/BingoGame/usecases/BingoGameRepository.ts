import { BingoGame } from "../models/BingoGame";

export type BingoGameRepository = {
  findOneById: (bingoGameId: string) => Promise<BingoGame>;
  save: (bingoGame: BingoGame) => Promise<void>;
};
