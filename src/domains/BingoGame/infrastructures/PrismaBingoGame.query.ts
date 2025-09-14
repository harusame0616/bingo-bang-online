import prisma from "@/lib/prisma";

import type {
	BingoGameDtoWithCards,
	BingoGameQuery,
	BingoGameViewDtoWithCards,
} from "../usecases/BingoGame.query";

export class PrismaBingoGameQuery implements BingoGameQuery {
	async findOneByViewIdWithCards(
		viewId: string,
	): Promise<BingoGameViewDtoWithCards> {
		const bingoGame = await prisma.bingoGameEntity.findUnique({
			include: { bingoCards: true },
			where: { viewId },
		});

		if (!bingoGame) {
			throw new Error();
		}

		const { id: _, ...bingoGameWithoutId } = bingoGame;

		return {
			...bingoGameWithoutId,
			state: "created",
			bingoCards:
				bingoGame.bingoCards?.map((card) => ({
					id: card.id,
					squares: [
						card.squares.slice(0, 5),
						card.squares.slice(5, 10),
						card.squares.slice(10, 15),
						card.squares.slice(15, 20),
						card.squares.slice(20, 25),
					],
					name: card.name,
				})) || [],
		};
	}

	async findOneByIdWithCards(
		bingoGameId: string,
	): Promise<BingoGameDtoWithCards | null> {
		const bingoGame = await prisma.bingoGameEntity.findUnique({
			where: { id: bingoGameId },
			include: { bingoCards: true },
		});

		if (!bingoGame) {
			return null;
		}

		return {
			...bingoGame,
			state: "created",
			bingoCards:
				bingoGame.bingoCards?.map((card) => ({
					id: card.id,
					squares: [
						card.squares.slice(0, 5),
						card.squares.slice(5, 10),
						card.squares.slice(10, 15),
						card.squares.slice(15, 20),
						card.squares.slice(20, 25),
					],
					name: card.name,
					bingoGameId: card.bingoGameId,
				})) || [],
		};
	}
}
