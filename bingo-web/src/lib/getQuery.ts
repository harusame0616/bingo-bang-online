import { PrismaBingoGameQuery } from '@/domains/BingoGame/infrastructures/PrismaBingoGame.query';
import { BingoGameQuery } from '@/domains/BingoGame/usecases/BingoGame.query';

type QueryMap = {
  bingoGame: BingoGameQuery;
};

const queryMap: QueryMap = {
  // bingoGame: new InMemoryBingoGameQuery(),
  bingoGame: new PrismaBingoGameQuery(),
};

export function getQuery<T extends keyof QueryMap>(queryName: T): QueryMap[T] {
  return queryMap[queryName];
}
