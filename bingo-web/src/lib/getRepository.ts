import { InMemoryGameRepository } from "@/domains/BingoGame/infrastructures/IMBingoGameRepository";
import { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGameRepository";

type RepositoryMap = {
  bingoGame: BingoGameRepository;
};

const repositoryMap: RepositoryMap = {
  bingoGame: new InMemoryGameRepository(),
};

export function getRepository<T extends keyof RepositoryMap>(
  repositoryName: T
): RepositoryMap[T] {
  return repositoryMap[repositoryName];
}
