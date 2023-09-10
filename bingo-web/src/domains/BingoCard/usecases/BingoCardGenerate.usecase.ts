import { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGame.repository";
import { BingoCardRepository } from "./BingoCard.repository";
import { BingoCardGenerateDomainService } from "../models/BingCardGenerate.domain-service";
import { BingoCardDto } from "../models/BingoCard";

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

  async execute(bingoGameId: string): Promise<BingoCardGenerateUsecaseDto> {
    const { bingoCard, bingoGame } = await this.generateDomainService.execute({
      bingoGameId,
    });

    return {
      bingoCard: bingoCard.toDto(),
      bingoGameId: bingoGame.id,
    };
  }
}
