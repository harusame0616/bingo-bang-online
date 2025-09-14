import prisma from '@/lib/prisma';

import { BingoGame } from '../models/BingoGame';
import type { BingoGameRepository } from '../usecases/BingoGame.repository';

export class PrismaBingoGameRepository implements BingoGameRepository {
  async findOneById(bingoGameId: string): Promise<BingoGame | null> {
    const bingoGame = await prisma.bingoGameEntity.findUnique({
      where: { id: bingoGameId },
    });
    if (!bingoGame) {
      return null;
    }

    return BingoGame.fromDto({
      id: bingoGame.id,
      lotteryNumbers: bingoGame.lotteryNumbers,
      viewId: bingoGame.viewId,
      hashedManagementPassword: null,
      state: 'created',
    });
  }

  async save(bingoGame: BingoGame): Promise<void> {
    const {
      hashedManagementPassword: _,
      state: __,
      ...bingoGameDto
    } = bingoGame.toDto();
    await prisma.bingoGameEntity.upsert({
      where: { id: bingoGame.id },
      create: bingoGameDto,
      update: bingoGameDto,
    });
  }
}
