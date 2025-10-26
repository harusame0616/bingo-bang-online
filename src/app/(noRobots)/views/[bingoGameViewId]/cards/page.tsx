import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

import { BingoCardList } from "@/app/_components/bingo-card-list";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import { getBingoCards } from "@/app/(noRobots)/games/[bingoGameId]/cards/get-bingo-cards";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getBingoGameId } from "../get-bingo-game-id";

export default function Page({
	params,
}: PageProps<"/views/[bingoGameViewId]/cards">) {
	const bingoGameViewId = params.then(({ bingoGameViewId }) => bingoGameViewId);

	return (
		<article>
			<Heading>
				<span>ビンゴカード一覧</span>
			</Heading>
			<Suspense fallback={<BingoCardsSkeleton />}>
				<BingoCardsContainer viewId={bingoGameViewId} />
			</Suspense>
		</article>
	);
}

async function BingoCardsContainer({ viewId }: { viewId: Promise<string> }) {
	"use cache";

	cacheLife("permanent");

	const resolvedViewId = await viewId;
	const bingoGameId = await getBingoGameId(resolvedViewId);

	cacheTag(
		CACHE_TAGS.bingoCards(bingoGameId),
		CACHE_TAGS.bingoGameDelete(bingoGameId),
	);

	const bingoCards = await getBingoCards(bingoGameId);

	if (!bingoCards.length) {
		return <BingoCardsNoRegister />;
	}

	return (
		<BingoCardsPresenter viewId={resolvedViewId} bingoCards={bingoCards} />
	);
}

async function BingoCardsPresenter({
	bingoCards,
	viewId,
}: {
	viewId: string;
	bingoCards: BingoCardEntity[];
}) {
	return (
		<BingoCardList>
			{bingoCards.map((bingoCard) => (
				<li key={bingoCard.id}>
					<BingoCard bingoCard={bingoCard} />

					<Link href={`/views/${viewId}/cards/${bingoCard.id}`}>
						閲覧ページ
					</Link>
				</li>
			))}
		</BingoCardList>
	);
}

function BingoCardsNoRegister() {
	return (
		<h2 className="mb-4 py-8 text-center text-lg font-bold text-primary-darken">
			ビンゴカードが登録されていません
		</h2>
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
					<Skeleton className="h-5 w-20" />
				</li>
			))}
		</BingoCardList>
	);
}
