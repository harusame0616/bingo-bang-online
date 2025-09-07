import { BingoGameDto } from '../models/BingoGame';

declare global {
  // eslint-disable-next-line no-var
  var bingoGameStore: Map<string, BingoGameDto>;
}
global.bingoGameStore =
  global.bingoGameStore || new Map<string, BingoGameDto>();
export const bingoGameStore = global.bingoGameStore;
