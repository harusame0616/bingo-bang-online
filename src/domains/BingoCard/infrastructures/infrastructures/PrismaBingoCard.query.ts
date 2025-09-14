import type { BingoCardDtoForDetailPage } from "@/app/(noRobots)/views/[bingoGameViewId]/cards/[cardId]/BingoCardDetailPageQueryUsecase";
import prisma from "@/lib/prisma";

import type { BingoCardQuery } from "../../usecases/BingoCard.query";

export class PrismaBingoCardQuery implements BingoCardQuery {
	async findOneBingoCardForDetailPage(
		bingoCardId: string,
	): Promise<BingoCardDtoForDetailPage> {
		const bingoCard = await prisma.bingoCardEntity.findUnique({
			where: { id: bingoCardId },
			select: { id: true, name: true, squares: true, bingoGameId: false },
		});

		if (bingoCard === null) {
			throw new Error();
		}

		return {
			...bingoCard,
			squares: [
				bingoCard.squares.slice(0, 5),
				bingoCard.squares.slice(5, 10),
				bingoCard.squares.slice(10, 15),
				bingoCard.squares.slice(15, 20),
				bingoCard.squares.slice(20, 25),
			],
		};
	}
}
