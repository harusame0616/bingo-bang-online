import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { LotteryHistoryContainer } from "../../_components/LotteryHistory";
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
	bingoGameId,
}: {
	bingoGameId: Promise<string>;
}) {
	const resolvedBingoGameId = await bingoGameId;
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { id: resolvedBingoGameId },
		select: { sound: true },
	});

	if (!bingoGame) {
		return notFound();
	}

	return (
		<SoundSetting bingoGameId={resolvedBingoGameId} sound={bingoGame.sound} />
	);
}
