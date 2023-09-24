import { BingoCardDto } from '@/domains/BingoCard/models/BingoCard';
import { BingoCardQuery } from '@/domains/BingoCard/usecases/BingoCard.query';

export type BingoCardDtoForDetailPage = Omit<BingoCardDto, 'bingoGameId'>;
export class BingoCardDetailPageQueryUsecase {
  constructor(private readonly bingoCardQuery: BingoCardQuery) {}
  async execute(bingoCardId: string) {
    return await this.bingoCardQuery.findOneBingoCardForDetailPage(bingoCardId);
  }
}
