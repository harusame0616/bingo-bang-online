type BingoGameRepository = {
  save: (bingoGame: BingoGame) => Promise<void>;
};
