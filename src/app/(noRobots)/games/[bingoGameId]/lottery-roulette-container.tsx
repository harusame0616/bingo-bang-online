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
	bingoGameId: string;
}
export async function LotteryRouletteContainer({ bingoGameId }: Props) {
	const bingoGame = await getBingoGame(bingoGameId);

	return (
		<LotteryRoulettePresenter
			bingoGameId={bingoGameId}
			finish={bingoGame.lotteryNumbers.length === 75}
			sound={bingoGame.sound}
		/>
	);
}
