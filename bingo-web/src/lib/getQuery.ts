import { InMemoryBingoCardRepository } from "@/domains/BingoCard/infrastructures/infrastructures/IMBingoCardRepository";
import { BingoCardRepository } from "@/domains/BingoCard/usecases/BingoCard.repository";
import { InMemoryBingoGameQuery } from "@/domains/BingoGame/infrastructures/IMBingoGameQuery";
import { InMemoryGameRepository } from "@/domains/BingoGame/infrastructures/InMemoryGameRepository";
import { BingoGameQuery } from "@/domains/BingoGame/usecases/BingoGame.query";
import { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGame.repository";

type QueryMap = {
  bingoGame: BingoGameQuery;
};

const queryMap: QueryMap = {
  bingoGame: new InMemoryBingoGameQuery(),
};

export function getQuery<T extends keyof QueryMap>(queryName: T): QueryMap[T] {
  return queryMap[queryName];
}
