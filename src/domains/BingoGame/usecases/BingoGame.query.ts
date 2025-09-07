import { BingoCardDto } from '@/domains/BingoCard/models/BingoCard';

import { BingoGameDto } from '../models/BingoGame';

export type BingoGameViewDtoWithCards = Omit<
  BingoGameDto,
  'hashedManagementPassword' | 'bingoCardIds' | 'id'
> & {
  bingoCards: Omit<BingoCardDto, 'bingoGameId'>[];
};

export type BingoGameDtoWithCards = Omit<
  BingoGameDto,
  'hashedManagementPassword' | 'bingoCardIds'
> & {
  bingoCards: BingoCardDto[];
};

export interface BingoGameQuery {
  findOneByViewIdWithCards: (
    bingoGameId: string,
  ) => Promise<BingoGameViewDtoWithCards>;

  findOneByIdWithCards: (
    bingoGameId: string,
  ) => Promise<BingoGameDtoWithCards | null>;
}
