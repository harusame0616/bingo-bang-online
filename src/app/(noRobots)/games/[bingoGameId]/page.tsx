import { ReloadIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import * as v from "valibot";

import { LotteryHistoryContainer } from "../../_components/LotteryHistory";
import { LotteryRouletteContainer } from "./_components/lottery-roulette-container";
import LotteryRoulettePresenter from "./_components/LotteryRoulette";

export default async function BingoGameLotteryPage({
	params,
	searchParams,
}: PageProps<"/games/[bingoGameId]">) {
	const [{ sound }, { bingoGameId }] = await Promise.all([
		parseSearchParams(await searchParams),
		params,
	]);

	return (
		<article>
			<Suspense
				fallback={
					<LotteryRoulettePresenter
						bingoGameId={bingoGameId}
						finish={false}
						loading
					/>
				}
			>
				<LotteryRouletteContainer bingoGameId={bingoGameId} sound={sound} />
			</Suspense>
			<div className="my-8">
				<Suspense
					fallback={<ReloadIcon className="mx-auto h-12 w-12 animate-spin" />}
				>
					<LotteryHistoryContainer bingoGameId={bingoGameId} />
				</Suspense>
			</div>
		</article>
	);
}

function parseSearchParams(searchParams: unknown) {
	return v.parse(
		v.object({
			sound: v.pipe(
				v.optional(v.string(), "on"),
				v.transform((v) => v === "on"),
			),
		}),
		searchParams,
	);
}
