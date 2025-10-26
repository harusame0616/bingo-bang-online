import { ReloadIcon } from "@radix-ui/react-icons";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getSoundSetting } from "./get-sound-setting";
import { LotteryHistoryContainer } from "./lottery-history";
import { LotteryRouletteContainer } from "./lottery-roulette-container";
import { LotteryRoulettePresenter } from "./lottery-roulette-presenter";
import { SoundSetting } from "./sound-setting";

export default async function BingoGameLotteryPage({
	params,
}: PageProps<"/games/[bingoGameId]">) {
	const bingoGameId = params.then(({ bingoGameId }) => bingoGameId);

	return (
		<div>
			<Suspense
				fallback={
					<LotteryRoulettePresenter bingoGameId="" finish={false} loading />
				}
			>
				<LotteryRouletteContainer bingoGameId={bingoGameId} />
			</Suspense>
			<div className="my-8">
				<Suspense
					fallback={<ReloadIcon className="mx-auto h-12 w-12 animate-spin" />}
				>
					<LotteryHistoryContainer bingoGameId={bingoGameId} />
				</Suspense>
			</div>
			<Suspense fallback={<SoundSetting bingoGameId="" sound disabled />}>
				<SoundSettingContainer bingoGameId={bingoGameId} />
			</Suspense>
		</div>
	);
}

async function SoundSettingContainer({
	bingoGameId: bingoGameIdPromise,
}: {
	bingoGameId: Promise<string>;
}) {
	"use cache";

	cacheLife("permanent");

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(
		CACHE_TAGS.soundSetting(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

	const soundSetting = await getSoundSetting(bingoGameId);

	return <SoundSetting bingoGameId={bingoGameId} sound={soundSetting} />;
}
