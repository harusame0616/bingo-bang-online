import { BingoCardDtoForDetailPage } from '@/app/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase';

import { BingoCardQuery } from '../../usecases/BingoCard.query';
import { bingoCardStore } from './IMBingoCardStore';

export class InMemoryBingoCardQuery implements BingoCardQuery {
  async findOneBingoCardForDetailPage(
    bingoCardId: string,
  ): Promise<BingoCardDtoForDetailPage | null> {
    const bingoCard = bingoCardStore.get(bingoCardId);
    if (!bingoCard) {
      return null;
    }

    const { bingoGameId: _, ...bingoCardDtoWithoutBingoGameId } = bingoCard;

    return bingoCardDtoWithoutBingoGameId;
  }
}
