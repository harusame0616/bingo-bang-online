import { BingoGameRepository } from '@/domains/BingoGame/usecases/BingoGame.repository';

import { BingoCardRepository } from '../usecases/BingoCard.repository';

type ConstructorProps = {
  bingoCardRepository: BingoCardRepository;
  bingoGameRepository: BingoGameRepository;
};

export type BingoCardGenerationProps = {
  name?: string;
};

export class BingoCardDeleteDomainService {
  bingoCardRepository: BingoCardRepository;
  bingoGameRepository: BingoGameRepository;
  constructor({ bingoCardRepository, bingoGameRepository }: ConstructorProps) {
    this.bingoCardRepository = bingoCardRepository;
    this.bingoGameRepository = bingoGameRepository;
  }

  async execute(bingoGameId: string, bingoCardId: string) {
    const bingoGame = await this.bingoGameRepository.findOneById(bingoGameId);

    if (!bingoGame) {
      throw new Error('BingoGame not found');
    }

    await Promise.all([this.bingoCardRepository.delete(bingoCardId)]);
  }
}
