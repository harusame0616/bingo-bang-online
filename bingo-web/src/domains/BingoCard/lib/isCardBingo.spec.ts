import { describe, expect, it } from 'vitest';

import { FREE } from '../models/BingoCard';
import { isCardBingo } from './isCardBingo';

const bingoCard = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, FREE, 13, 14],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
];

describe('isCardBingo', () => {
  it.each([
    [[1, 2, 3, 4, 5]],
    [[6, 7, 8, 9, 10]],
    [[11, 12, 13, 14]],
    [[16, 17, 18, 19, 20]],
    [[21, 22, 23, 24, 25]],
  ])('横のラインが揃ったときに true を返す: %s', (lotteryNumbers: number[]) => {
    expect(isCardBingo(lotteryNumbers, bingoCard)).toBe(true);
  });

  it.each([[[1, 7, 3, 19, 25]], [[5, 9, 17, 21]]])(
    '斜めのラインが揃ったときに true を返す: %s',
    (lotteryNumbers: number[]) => {
      expect(isCardBingo(lotteryNumbers, bingoCard)).toBe(true);
    },
  );

  it.each([
    [[1, 6, 11, 16, 21]],
    [[2, 7, 12, 17, 22]],
    [[3, 8, 18, 23]],
    [[4, 9, 13, 19, 24]],
    [[5, 10, 14, 20, 25]],
  ])('縦のラインが揃ったときに true を返す: %s', (lotteryNumbers: number[]) => {
    expect(isCardBingo(lotteryNumbers, bingoCard)).toBe(true);
  });

  it.each([[[1, 2, 3, 4, 10]], [[1, 6, 11, 16, 2]]])(
    'ラインが揃っていないときに false を返す: %s',
    (lotteryNumbers: number[]) => {
      expect(isCardBingo(lotteryNumbers, bingoCard)).toBe(false);
    },
  );
});
