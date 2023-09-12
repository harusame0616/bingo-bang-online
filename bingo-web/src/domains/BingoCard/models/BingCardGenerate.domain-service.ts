import { BingoGameRepository } from '@/domains/BingoGame/usecases/BingoGame.repository';

import { BingoCardRepository } from '../usecases/BingoCard.repository';
import { BingoCard, GenerateCardProps } from './BingoCard';

type ConstructorProps = {
  bingoCardRepository: BingoCardRepository;
  bingoGameRepository: BingoGameRepository;
};

export type BingoCardGenerationProps = {
  name?: string;
};

// BingoCard 生成時は BingoGame が存在していることの確認と
// BingoGame へ BingoCard の登録が必要
export class BingoCardGenerateDomainService {
  bingoCardRepository: BingoCardRepository;
  bingoGameRepository: BingoGameRepository;
  constructor({ bingoCardRepository, bingoGameRepository }: ConstructorProps) {
    this.bingoCardRepository = bingoCardRepository;
    this.bingoGameRepository = bingoGameRepository;
  }

  async execute(
    bingoGameId: string,
    generateCardProps: GenerateCardProps = {},
  ) {
    const bingoGame = await this.bingoGameRepository.findOneById(bingoGameId);

    if (!bingoGame) {
      throw new Error('BingoGame not found');
    }

    const bingoCard = BingoCard.generateCard(bingoGameId, generateCardProps);

    await Promise.all([this.bingoCardRepository.save(bingoCard)]);

    return { bingoGame, bingoCard };
  }
}
