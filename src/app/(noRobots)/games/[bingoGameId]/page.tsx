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
	const { bingoGameId } = await params;

	return (
		<div>
			<Suspense
				fallback={
					<LotteryRoulettePresenter
						bingoGameId={bingoGameId}
						finish={false}
						loading
					/>
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
			<Suspense
				fallback={<SoundSetting bingoGameId={bingoGameId} sound disabled />}
			>
				<SoundSettingContainer bingoGameId={bingoGameId} />
			</Suspense>
		</div>
	);
}

async function SoundSettingContainer({ bingoGameId }: { bingoGameId: string }) {
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { id: bingoGameId },
		select: { sound: true },
	});

	if (!bingoGame) {
		return notFound();
	}

	return <SoundSetting bingoGameId={bingoGameId} sound={bingoGame.sound} />;
}
