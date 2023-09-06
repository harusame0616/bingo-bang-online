import { BingoCard } from "../models/BingoCard";

export type BingoCardRepository = {
  save: (bingoGame: BingoCard) => Promise<void>;
};
