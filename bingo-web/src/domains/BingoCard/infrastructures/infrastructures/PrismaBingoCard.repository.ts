import { prisma } from '@/lib/prisma';

import { BingoCard } from '../../models/BingoCard';
import { BingoCardRepository } from '../../usecases/BingoCard.repository';

export class PrismaBingoCardRepository implements BingoCardRepository {
  async save(bingoCard: BingoCard): Promise<void> {
    const bingoCardDto = bingoCard.toDto();
    const bingoCardEntity = {
      id: bingoCard.id,
      squares: bingoCardDto.squares.flat(),
      name: bingoCardDto.name,
      bingoGameId: bingoCard.bingoGameId,
    };

    await prisma.bingoCardEntity.upsert({
      where: { id: bingoCard.id },
      create: bingoCardEntity,
      update: bingoCardEntity,
    });
  }

  async delete(bingoCardId: string): Promise<void> {
    prisma.bingoCardEntity.delete({ where: { id: bingoCardId } });
  }
}
