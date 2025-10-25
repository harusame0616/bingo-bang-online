import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { LotteryRoulettePresenter } from "./lottery-roulette-presenter";

async function getBingoGame(bingoGameId: string) {
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: {
			id: bingoGameId,
		},
	});
	if (!bingoGame) {
		notFound();
	}

	return bingoGame;
}

interface Props {
	bingoGameId: Promise<string>;
}
export async function LotteryRouletteContainer({ bingoGameId }: Props) {
	const resolvedBingoGameId = await bingoGameId;
	const bingoGame = await getBingoGame(resolvedBingoGameId);

	return (
		<LotteryRoulettePresenter
			bingoGameId={resolvedBingoGameId}
			finish={bingoGame.lotteryNumbers.length === 75}
			sound={bingoGame.sound}
		/>
	);
}
