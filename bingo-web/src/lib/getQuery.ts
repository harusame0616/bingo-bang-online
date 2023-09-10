import { InMemoryBingoGameQuery } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.query";
import { BingoGameQuery } from "@/domains/BingoGame/usecases/BingoGame.query";

type QueryMap = {
  bingoGame: BingoGameQuery;
};

const queryMap: QueryMap = {
  bingoGame: new InMemoryBingoGameQuery(),
};

export function getQuery<T extends keyof QueryMap>(queryName: T): QueryMap[T] {
  return queryMap[queryName];
}
