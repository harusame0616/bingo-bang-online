import { bingoCardStore } from "@/domains/BingoCard/infrastructures/infrastructures/IMBingoCardStore";

import type {
	BingoGameDtoWithCards,
	BingoGameQuery,
} from "../usecases/BingoGame.query";
import { bingoGameStore } from "./InMemoryBIngoGame.store";

export class InMemoryBingoGameQuery implements BingoGameQuery {
	async findOneByViewIdWithCards(
		bingoGameViewId: string,
	): Promise<BingoGameDtoWithCards> {
		const bingoGame = Array.from(bingoGameStore.values()).find(
			(bingoGame) => bingoGame.viewId === bingoGameViewId,
		);

		if (!bingoGame) {
			throw new Error();
		}

		const bingoCards = Array.from(bingoCardStore.values()).filter(
			(card) => card.bingoGameId === bingoGameViewId,
		);

		const { hashedManagementPassword: _, ...bingoGameDtoWithoutBingoCardIds } =
			bingoGame;

		return {
			...bingoGameDtoWithoutBingoCardIds,
			bingoCards,
		};
	}
	async findOneByIdWithCards(
		bingoGameId: string,
	): Promise<BingoGameDtoWithCards | null> {
		const bingoGame = bingoGameStore.get(bingoGameId);

		if (!bingoGame) {
			return null;
		}

		const bingoCards = Array.from(bingoCardStore.values()).filter(
			(card) => card.bingoGameId === bingoGameId,
		);

		const { hashedManagementPassword: _, ...bingoGameDtoWithoutBingoCardIds } =
			bingoGame;

		return {
			...bingoGameDtoWithoutBingoCardIds,
			bingoCards,
		};
	}
}
