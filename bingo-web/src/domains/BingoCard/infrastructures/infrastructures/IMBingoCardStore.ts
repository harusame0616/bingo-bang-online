import { BingoCardDto } from '../../models/BingoCard';

declare global {
  // eslint-disable-next-line no-var
  var bingoCardStore: Map<string, BingoCardDto>;
}

global.bingoCardStore =
  global.bingoCardStore || new Map<string, BingoCardDto>();
export const bingoCardStore = global.bingoCardStore;
