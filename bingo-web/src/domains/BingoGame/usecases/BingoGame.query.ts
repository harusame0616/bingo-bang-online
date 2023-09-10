import { BingoCardDto } from '@/domains/BingoCard/models/BingoCard';

import { BingoGameDto } from '../models/BingoGame';

export type BingoGameDtoWithCards = Omit<
  BingoGameDto,
  'hashedManagementPassword' | 'bingoCardIds'
> & {
  bingoCards: Array<BingoCardDto>;
};

export type BingoGameQuery = {
  findOneByIdWithCards: (
    bingoGameId: string,
  ) => Promise<BingoGameDtoWithCards | null>;
};
