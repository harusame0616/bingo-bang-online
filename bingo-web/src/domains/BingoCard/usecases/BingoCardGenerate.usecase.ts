import { BingoGameRepository } from '@/domains/BingoGame/usecases/BingoGame.repository';

import { BingoCardGenerateDomainService } from '../models/BingCardGenerate.domain-service';
import { BingoCardDto, GenerateCardProps } from '../models/BingoCard';
import { BingoCardRepository } from './BingoCard.repository';

type BingoCardGenerateUsecaseDto = {
  bingoCard: BingoCardDto;
  bingoGameId: string;
};

type ConstructorProps = {
  bingoGameRepository: BingoGameRepository;
  bingoCardRepository: BingoCardRepository;
};
export class BingoCardGenerateUsecase {
  private generateDomainService: BingoCardGenerateDomainService;

  constructor(props: ConstructorProps) {
    this.generateDomainService = new BingoCardGenerateDomainService(props);
  }

  async execute(
    bingoGameId: string,
    generateBingoCardProps: GenerateCardProps = {},
  ): Promise<BingoCardGenerateUsecaseDto> {
    const { bingoCard, bingoGame } = await this.generateDomainService.execute(
      bingoGameId,
      generateBingoCardProps,
    );

    return {
      bingoCard: bingoCard.toDto(),
      bingoGameId: bingoGame.id,
    };
  }
}
