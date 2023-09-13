import { BingoCardDto } from '@/domains/BingoCard/models/BingoCard';

import { BingoGameDto } from '../models/BingoGame';

export type BingoGameViewDtoWithCards = Omit<
  BingoGameDto,
  'hashedManagementPassword' | 'bingoCardIds' | 'id'
> & {
  bingoCards: Array<BingoCardDto>;
};

export type BingoGameDtoWithCards = Omit<
  BingoGameDto,
  'hashedManagementPassword' | 'bingoCardIds'
> & {
  bingoCards: Array<BingoCardDto>;
};

export type BingoGameQuery = {
  findOneByViewIdWithCards: (
    bingoGameId: string,
  ) => Promise<BingoGameViewDtoWithCards | null>;

  findOneByIdWithCards: (
    bingoGameId: string,
  ) => Promise<BingoGameDtoWithCards | null>;
};
