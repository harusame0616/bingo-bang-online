import { BingoCardDtoForDetailPage } from '@/app/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase';

export interface BingoCardQuery {
  findOneBingoCardForDetailPage: (
    bingoCardId: string,
  ) => Promise<BingoCardDtoForDetailPage | null>;
}
