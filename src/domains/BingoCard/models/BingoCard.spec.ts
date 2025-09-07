import { describe, expect, it } from 'vitest';

import { BingoCard } from './BingoCard';

const FREE = 0;
describe('BingoCard', () => {
  describe('generateCard', () => {
    it('ビンゴカードが作成できる', () => {
      const card = BingoCard.generateCard('gameId');

      const cardDto = card.toDto();
      expect(cardDto).toEqual({
        id: expect.any(String),
        name: '',
        squares: [
          [...new Array(5)].map(() => expect.any(Number)),
          [...new Array(5)].map(() => expect.any(Number)),
          [
            expect.any(Number),
            expect.any(Number),
            FREE, // 中央がフリー
            expect.any(Number),
            expect.any(Number),
          ],
          [...new Array(5)].map(() => expect.any(Number)),
          [...new Array(5)].map(() => expect.any(Number)),
        ],
        bingoGameId: 'gameId',
      });
    });

    it('ビンゴカードの値に重複がない', () => {
      const card = BingoCard.generateCard('bingoGameId');

      const cardNumbers = Array.from(new Set(card.toDto().squares.flat()));
      expect(cardNumbers.length).toBe(25);
    });

    it('ビンゴカードの値が範囲内に収まっている', () => {
      const MAX = 75;
      const MIN = 1;
      const card = BingoCard.generateCard('bingoGameId');

      const cardNumbers = Array.from(new Set(card.toDto().squares.flat()));
      expect(
        cardNumbers.every((num) => (num >= MIN && num <= MAX) || num === FREE),
      ).toBe(true);
    });

    it('名前をつけて作成ができる', () => {
      const name = 'bingo-card';
      const card = BingoCard.generateCard('bingoGameId', { name });

      expect(card.name).toBe(name);
    });
  });
});
