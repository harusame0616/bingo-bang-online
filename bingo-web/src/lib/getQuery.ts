import { PrismaBingoCardQuery } from '@/domains/BingoCard/infrastructures/infrastructures/PrismaBingoCard.query';
import { BingoCardQuery } from '@/domains/BingoCard/usecases/BingoCard.query';
import { PrismaBingoGameQuery } from '@/domains/BingoGame/infrastructures/PrismaBingoGame.query';
import { BingoGameQuery } from '@/domains/BingoGame/usecases/BingoGame.query';

interface QueryMap {
  bingoGame: BingoGameQuery;
  bingoCard: BingoCardQuery;
}

const queryMap: QueryMap = {
  // bingoGame: new InMemoryBingoGameQuery(),
  bingoGame: new PrismaBingoGameQuery(),
  bingoCard: new PrismaBingoCardQuery(),
};

export function getQuery<T extends keyof QueryMap>(queryName: T): QueryMap[T] {
  return queryMap[queryName];
}
