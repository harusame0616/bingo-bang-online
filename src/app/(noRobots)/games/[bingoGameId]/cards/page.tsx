import { cacheTag } from "next/cache";
import { Suspense } from "react";

import { Heading } from "@/app/(noRobots)/_components/Heading";
import { BingoCardList } from "@/app/_components/bingo-card-list";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { Section } from "@/components/BoxSection";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import { CACHE_TAGS } from "@/lib/cache-tags";

import { getLotteryNumbers } from "../get-lottery-numbers";
import { DeleteBingoCardButton } from "./delete-bingo-card-button";
import { BingoCardGenerationForm } from "./generate-bingo-card-form";
import { getBingoCards } from "./get-bingo-cards";

export default function NextPage({
	params,
}: PageProps<"/games/[bingoGameId]/cards">) {
	const bingoGameId = params.then((p) => p.bingoGameId);

	return (
		<div>
			<Section>
				<Heading>ビンゴカード生成</Heading>
				<Suspense fallback={<BingoCardGenerationForm disabled />}>
					<BingoCardGenerationFormContainer bingoGameId={bingoGameId} />
				</Suspense>
			</Section>
			<Section>
				<Heading>ビンゴカードリスト</Heading>
				<Suspense fallback={<BingoCardsSkeleton />}>
					<BingoCardsContainer bingoGameId={bingoGameId} />
				</Suspense>
			</Section>
		</div>
	);
}

async function BingoCardGenerationFormContainer({
	bingoGameId: bingoGameIdPromise,
}: {
	bingoGameId: Promise<string>;
}) {
	const bingoGameId = await bingoGameIdPromise;

	return <BingoCardGenerationForm bingoGameId={bingoGameId} />;
}

async function BingoCardsContainer({
	bingoGameId: bingoGameIdPromise,
}: {
	bingoGameId: Promise<string>;
}) {
	"use cache";

	const bingoGameId = await bingoGameIdPromise;

	cacheTag(
		CACHE_TAGS.bingoCards(bingoGameId),
		CACHE_TAGS.lotteryNumber(bingoGameId),
	);

	const [bingoCards, lotteryNumbers] = await Promise.all([
		getBingoCards(bingoGameId),
		getLotteryNumbers(bingoGameId),
	]);

	return (
		<BingoCardsPresenter
			bingoGameId={bingoGameId}
			bingoCards={bingoCards}
			lotteryNumbers={lotteryNumbers}
		/>
	);
}

function BingoCardsPresenter({
	bingoGameId,
	bingoCards,
	lotteryNumbers,
}: {
	bingoGameId: string;
	bingoCards: BingoCardEntity[];
	lotteryNumbers: number[];
}) {
	return (
		<BingoCardList aria-label="ビンゴカード">
			{bingoCards.map((bingoCard) => (
				<li key={bingoCard.id} className="">
					<BingoCard bingoCard={bingoCard} lotteryNumbers={lotteryNumbers} />
					<DeleteBingoCardButton
						bingoGameId={bingoGameId}
						bingoCardId={bingoCard.id}
						bingoCardName={bingoCard.name || "名無し"}
					/>
				</li>
			))}
		</BingoCardList>
	);
}

function BingoCardsSkeleton() {
	const rows = Array.from({ length: 5 });
	const cols = Array.from({ length: 5 });

	return (
		<BingoCardList>
			{Array.from({ length: 6 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton is a static display, order never changes
				<li key={index}>
					<Card className="p-2">
						<figure>
							<figcaption className="pb-1 text-sm">
								<Skeleton className="h-[1.25rem] w-32" />
							</figcaption>
							<ul>
								{rows.map((_, ri) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton is a static 5x5 grid, order never changes
									<li key={ri}>
										<ul className="grid grid-cols-5">
											{cols.map((_, ci) => (
												<li
													// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton is a static 5x5 grid, order never changes
													key={ci}
													className="relative flex h-0 grow-0 border border-gray-200 pb-[100%]"
												>
													<div className="absolute inset-0 flex items-center justify-center">
														<Skeleton className="h-4 w-4" />
													</div>
												</li>
											))}
										</ul>
									</li>
								))}
							</ul>
						</figure>
					</Card>
					<div className="p-2">
						<Skeleton className="h-4 w-4" />
					</div>
				</li>
			))}
		</BingoCardList>
	);
}
