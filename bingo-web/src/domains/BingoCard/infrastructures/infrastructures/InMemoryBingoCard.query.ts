import { BingoCardDtoForDetailPage } from '@/app/(noRobots)/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase';

import { BingoCardQuery } from '../../usecases/BingoCard.query';
import { bingoCardStore } from './IMBingoCardStore';

export class InMemoryBingoCardQuery implements BingoCardQuery {
  async findOneBingoCardForDetailPage(
    bingoCardId: string,
  ): Promise<BingoCardDtoForDetailPage> {
    const bingoCard = bingoCardStore.get(bingoCardId);
    if (!bingoCard) {
      throw new Error();
    }

    const { bingoGameId: _, ...bingoCardDtoWithoutBingoGameId } = bingoCard;

    return bingoCardDtoWithoutBingoGameId;
  }
}
