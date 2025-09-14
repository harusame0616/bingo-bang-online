import { BingoGame, type BingoGameDto } from "../models/BingoGame";
import type { BingoGameRepository } from "./BingoGame.repository";

type BingoGameCreateDto = Omit<BingoGameDto, "hashedManagementPassword">;

export class BingoGameCreateUsecase {
	constructor(private readonly bingoGameRepository: BingoGameRepository) {}

	async execute(): Promise<BingoGameCreateDto> {
		const bingoGame = BingoGame.createGame();

		await this.bingoGameRepository.save(bingoGame);

		const { hashedManagementPassword: _, ...bingoGameCreateDto } =
			bingoGame.toDto();

		return bingoGameCreateDto;
	}
}
