import { prisma } from "@repo/prisma";

import { BingoGame } from "../models/BingoGame";
import type { BingoGameRepository } from "../usecases/BingoGame.repository";

export class PrismaBingoGameRepository implements BingoGameRepository {
	async findOneById(bingoGameId: string): Promise<BingoGame | null> {
		const bingoGame = await prisma.bingoGameEntity.findUnique({
			where: { id: bingoGameId },
			include: {
				lotteryNumbers: {
					orderBy: { order: "asc" },
				},
			},
		});
		if (!bingoGame) {
			return null;
		}

		// LotteryNumberEntity[] を数値配列に変換
		const lotteryNumbers = bingoGame.lotteryNumbers.map(
			({ lotteryNumber }) => lotteryNumber,
		);

		return BingoGame.fromDto({
			id: bingoGame.id,
			lotteryNumbers,
			viewId: bingoGame.viewId,
			state: "created",
		});
	}

	async save(bingoGame: BingoGame): Promise<void> {
		const { state: _, lotteryNumbers, ...bingoGameDto } = bingoGame.toDto();

		await prisma.$transaction(async (tx) => {
			await tx.lotteryNumberEntity.deleteMany({
				where: { viewId: bingoGameDto.viewId },
			});

			await tx.bingoGameEntity.upsert({
				where: { id: bingoGameDto.id },
				create: bingoGameDto,
				update: bingoGameDto,
			});

			if (lotteryNumbers.length) {
				await tx.lotteryNumberEntity.createMany({
					data: lotteryNumbers.map((lotteryNumber, index) => ({
						viewId: bingoGameDto.viewId,
						lotteryNumber,
						order: index,
					})),
				});
			}
		});
	}
}
