import type { BingoGameDto } from "../models/BingoGame";
import type { BingoGameRepository } from "./BingoGame.repository";

type BingoGameFindOneDto = Omit<BingoGameDto, "hashedManagementPassword">;

export class BingoGameFindOneUsecase {
	constructor(private readonly bingoGameRepository: BingoGameRepository) {}

	async execute(bingoGameId: string): Promise<BingoGameFindOneDto> {
		const bingoGame = await this.bingoGameRepository.findOneById(bingoGameId);
		if (!bingoGame) {
			throw new Error("ビンゴゲームが見つかりません");
		}

		const { hashedManagementPassword: _, ...bingoGameDto } = bingoGame.toDto();

		return bingoGameDto;
	}
}
