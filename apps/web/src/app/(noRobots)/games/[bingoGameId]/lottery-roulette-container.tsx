import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
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

	cacheLife("permanent");

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(
		CACHE_TAGS.lotteryNumber(bingoGameId),
		CACHE_TAGS.soundSetting(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

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
