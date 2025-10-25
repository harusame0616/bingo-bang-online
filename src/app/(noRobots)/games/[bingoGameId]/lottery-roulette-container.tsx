import { cacheTag } from "next/cache";

import { getLotteryNumbers } from "./get-lottery-numbers";
import { getSoundSetting } from "./get-sound-setting";
import { LotteryRoulettePresenter } from "./lottery-roulette-presenter";

interface Props {
	bingoGameId: Promise<string>;
}
export async function LotteryRouletteContainer({
	bingoGameId: bingoGameIdPromise,
}: Props) {
	"use cache";

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(`${bingoGameId}-lottery-number`, `${bingoGameId}-sound-setting`);

	const [lotteryNumbers, soundSetting] = await Promise.all([
		getLotteryNumbers(bingoGameId),
		getSoundSetting(bingoGameId),
	]);

	return (
		<LotteryRoulettePresenter
			bingoGameId={bingoGameId}
			finish={lotteryNumbers.length === 75}
			sound={soundSetting}
		/>
	);
}
