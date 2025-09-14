import type { BingoCardRepository } from "./BingoCard.repository";

interface ConstructorProps {
	bingoCardRepository: BingoCardRepository;
}
export class BingoCardDeleteUsecase {
	private bingoCardRepository: BingoCardRepository;

	constructor({ bingoCardRepository }: ConstructorProps) {
		this.bingoCardRepository = bingoCardRepository;
	}

	async execute(bingoCardId: string): Promise<void> {
		await this.bingoCardRepository.delete(bingoCardId);
	}
}
