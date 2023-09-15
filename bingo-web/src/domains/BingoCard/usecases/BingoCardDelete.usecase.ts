import { BingoGameRepository } from '@/domains/BingoGame/usecases/BingoGame.repository';

import { BingoCardDeleteDomainService } from '../models/BingoCardDelete.domain-service';
import { BingoCardRepository } from './BingoCard.repository';

interface ConstructorProps {
  bingoGameRepository: BingoGameRepository;
  bingoCardRepository: BingoCardRepository;
}
export class BingoCardDeleteUsecase {
  private bingoCardDeleteDomainService: BingoCardDeleteDomainService;

  constructor(props: ConstructorProps) {
    this.bingoCardDeleteDomainService = new BingoCardDeleteDomainService(props);
  }

  async execute(bingoGameId: string, bingoCardId: string): Promise<void> {
    await this.bingoCardDeleteDomainService.execute(bingoGameId, bingoCardId);
  }
}
