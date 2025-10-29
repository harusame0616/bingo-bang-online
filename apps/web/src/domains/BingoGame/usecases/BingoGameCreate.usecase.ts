import { BingoGame, type BingoGameDto } from "../models/BingoGame";
import type { BingoGameRepository } from "./BingoGame.repository";

type BingoGameCreateDto = BingoGameDto;

export class BingoGameCreateUsecase {
	constructor(private readonly bingoGameRepository: BingoGameRepository) {}

	async execute(): Promise<BingoGameCreateDto> {
		const bingoGame = BingoGame.createGame();

		await this.bingoGameRepository.save(bingoGame);

		return bingoGame.toDto();
	}
}
