import { BingoCardDtoForDetailPage } from '@/app/(noRobots)/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase';
import { prisma } from '@/lib/prisma';

import { BingoCardQuery } from '../../usecases/BingoCard.query';

export class PrismaBingoCardQuery implements BingoCardQuery {
  async findOneBingoCardForDetailPage(
    bingoCardId: string,
  ): Promise<BingoCardDtoForDetailPage | null> {
    const bingoCard = await prisma.bingoCardEntity.findUnique({
      where: { id: bingoCardId },
      select: { id: true, name: true, squares: true, bingoGameId: false },
    });

    return bingoCard
      ? {
          ...bingoCard,
          squares: [
            bingoCard.squares.slice(0, 5),
            bingoCard.squares.slice(5, 10),
            bingoCard.squares.slice(10, 15),
            bingoCard.squares.slice(15, 20),
            bingoCard.squares.slice(20, 25),
          ],
        }
      : null;
  }
}
