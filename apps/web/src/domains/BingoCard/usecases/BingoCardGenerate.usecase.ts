import type { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGame.repository";

import { BingoCardGenerateDomainService } from "../models/BingCardGenerate.domain-service";
import type { BingoCardDto, GenerateCardProps } from "../models/BingoCard";
import type { BingoCardRepository } from "./BingoCard.repository";

interface BingoCardGenerateUsecaseDto {
	bingoCard: BingoCardDto;
	bingoGameId: string;
}

interface ConstructorProps {
	bingoGameRepository: BingoGameRepository;
	bingoCardRepository: BingoCardRepository;
}
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
