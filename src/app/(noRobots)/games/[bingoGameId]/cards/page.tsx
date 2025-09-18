import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BingoCardList } from "@/app/_components/bingo-card-list";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { Section } from "@/components/BoxSection";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import prisma from "@/lib/prisma";

import { DeleteBingoCardButton } from "./delete-bingo-card-button";
import { BingoCardGenerationForm } from "./generate-bingo-card-form";

export default async function NextPage({
	params,
}: PageProps<"/games/[bingoGameId]/cards">) {
	const { bingoGameId } = await params;

	return (
		<div>
			<Section>
				<Heading>ビンゴカード生成</Heading>
				<BingoCardGenerationForm bingoGameId={bingoGameId} />
			</Section>
			<Section>
				<Heading>ビンゴカードリスト</Heading>
				<Suspense
					fallback={
						<div className="flex justify-center">
							<ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
						</div>
					}
				>
					<BingoCardsContainer bingoGameId={bingoGameId} />
				</Suspense>
			</Section>
		</div>
	);
}

async function getBingoGame(bingoGameId: string) {
	const bingoGameEntity = await prisma.bingoGameEntity.findUnique({
		where: { id: bingoGameId },
		include: {
			bingoCards: true,
		},
	});

	if (!bingoGameEntity) {
		notFound();
	}

	return {
		bingoCards: bingoGameEntity.bingoCards || [],
		lotteryNumbers: bingoGameEntity.lotteryNumbers,
	};
}

async function BingoCardsContainer({ bingoGameId }: { bingoGameId: string }) {
	const { bingoCards, lotteryNumbers } = await getBingoGame(bingoGameId);

	return (
		<BingoCardsPresenter
			bingoCards={bingoCards}
			lotteryNumbers={lotteryNumbers}
		/>
	);
}

function BingoCardsPresenter({
	bingoCards,
	lotteryNumbers,
}: {
	bingoCards: BingoCardEntity[];
	lotteryNumbers: number[];
}) {
	return (
		<BingoCardList aria-label="ビンゴカード">
			{bingoCards.map((bingoCard) => (
				<li key={bingoCard.id} className="">
					<BingoCard bingoCard={bingoCard} lotteryNumbers={lotteryNumbers} />
					<DeleteBingoCardButton
						bingoCardId={bingoCard.id}
						bingoCardName={bingoCard.name || "名無し"}
					/>
				</li>
			))}
		</BingoCardList>
	);
}
