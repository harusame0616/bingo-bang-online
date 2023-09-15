import { PrismaBingoCardRepository } from '@/domains/BingoCard/infrastructures/infrastructures/PrismaBingoCard.repository';
import { BingoCardRepository } from '@/domains/BingoCard/usecases/BingoCard.repository';
import { PrismaBingoGameRepository } from '@/domains/BingoGame/infrastructures/PrismaBingoGame.repository';
import { BingoGameRepository } from '@/domains/BingoGame/usecases/BingoGame.repository';

interface RepositoryMap {
  bingoGame: BingoGameRepository;
  bingoCard: BingoCardRepository;
}

const repositoryMap: RepositoryMap = {
  // bingoGame: new InMemoryGameRepository(),
  // bingoCard: new InMemoryBingoCardRepository(),
  bingoGame: new PrismaBingoGameRepository(),
  bingoCard: new PrismaBingoCardRepository(),
};

export function getRepository<T extends keyof RepositoryMap>(
  repositoryName: T,
): RepositoryMap[T] {
  return repositoryMap[repositoryName];
}
