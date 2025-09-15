import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BingoCardList } from "@/app/_components/bingo-card-list";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import prisma from "@/lib/prisma";

export default async function Page({
	params,
}: PageProps<"/views/[bingoGameViewId]/cards">) {
	const { bingoGameViewId } = await params;

	return (
		<article>
			<Heading>
				<span>ビンゴカード一覧</span>
			</Heading>
			<Suspense fallback={<ReloadIcon className="animate-spin" />}>
				<BingoCardsContainer viewId={bingoGameViewId}></BingoCardsContainer>
			</Suspense>
		</article>
	);
}

async function getBingoCardsByViewId(viewId: string) {
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { viewId },
		include: { bingoCards: true },
	});

	if (!bingoGame) {
		notFound();
	}

	return bingoGame.bingoCards;
}

async function BingoCardsContainer({ viewId }: { viewId: string }) {
	const bingoCards = await getBingoCardsByViewId(viewId);

	if (!bingoCards.length) {
		return <BingoCardsNoRegister />;
	}

	return <BingoCardsPresenter viewId={viewId} bingoCards={bingoCards} />;
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
