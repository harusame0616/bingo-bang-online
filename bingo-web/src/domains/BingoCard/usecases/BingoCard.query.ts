import { BingoCardDtoForDetailPage } from '@/app/(noRobots)/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase';

export interface BingoCardQuery {
  findOneBingoCardForDetailPage: (
    bingoCardId: string,
  ) => Promise<BingoCardDtoForDetailPage>;
}
