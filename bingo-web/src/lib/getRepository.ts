import { InMemoryBingoCardRepository } from "@/domains/BingoCard/infrastructures/infrastructures/IMBingoCardRepository";
import { BingoCardRepository } from "@/domains/BingoCard/usecases/BingoCard.repository";
import { InMemoryGameRepository } from "@/domains/BingoGame/infrastructures/IMBingoGameRepository";
import { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGameRepository";

type RepositoryMap = {
  bingoGame: BingoGameRepository;
  bingoCard: BingoCardRepository;
};

const repositoryMap: RepositoryMap = {
  bingoGame: new InMemoryGameRepository(),
  bingoCard: new InMemoryBingoCardRepository(),
};

export function getRepository<T extends keyof RepositoryMap>(
  repositoryName: T
): RepositoryMap[T] {
  return repositoryMap[repositoryName];
}
