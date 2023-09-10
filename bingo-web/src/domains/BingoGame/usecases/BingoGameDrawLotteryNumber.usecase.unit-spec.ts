import { describe, expect, it } from 'vitest';

import { InMemoryGameRepository } from '../infrastructures/InMemoryBingoGame.repository';
import { BingoGameCreateUsecase } from './BingoGameCreate.usecase';
import { BingoGameDrawLotteryNumberUsecase } from './BingoGameDrawLotteryNumber.usecase';

describe('BingoGameDrawLotteryNumber', () => {
  describe('execute', () => {
    it('抽選ができる', async () => {
      const bingoGameRepository = new InMemoryGameRepository();

      const bingoGameCreateUsecase = new BingoGameCreateUsecase(
        bingoGameRepository,
      );
      const { id } = await bingoGameCreateUsecase.execute();

      const bingoGameDrawLotteryNumberUsecase =
        new BingoGameDrawLotteryNumberUsecase(bingoGameRepository);

      const bingoGameDto = await bingoGameDrawLotteryNumberUsecase.execute(id);

      const PLAYING = 'playing';
      expect(bingoGameDto).toEqual({
        id: expect.any(String),
        viewId: expect.any(String),
        lotteryNumbers: expect.any(Array),
        state: PLAYING,
        bingoCardIds: expect.any(Array),
      });

      // hashedMaganementPassword は返さない
      expect(bingoGameDto).not.toHaveProperty('hashedManagementPassword');
    });

    it('存在しない ID を指定したときに例外が発生する', async () => {
      const bingoGameRepository = new InMemoryGameRepository();

      const bingoGameDrawLotteryNumberUsecase =
        new BingoGameDrawLotteryNumberUsecase(bingoGameRepository);

      await expect(
        bingoGameDrawLotteryNumberUsecase.execute('ignore'),
      ).rejects.toThrow('ビンゴゲームが見つかりません');
    });
  });
});
