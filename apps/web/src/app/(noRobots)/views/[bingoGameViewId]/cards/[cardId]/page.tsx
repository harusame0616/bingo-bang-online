import { ReloadIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import prisma from "@/lib/prisma";

import { BingoDetailPresenter } from "./bingo-detail-presenter";

export default function NextPage({
	params,
}: PageProps<"/views/[bingoGameViewId]/cards/[cardId]">) {
	const cardId = params.then(({ cardId }) => cardId);

	return (
		<div className="mx-auto max-w-lg">
			<Suspense fallback={<ReloadIcon className="mx-auto p-8" />}>
				<BingoDetailContainer bingoCardId={cardId} />
			</Suspense>
			<p className="mt-8 ma">
				番号をタップするとマークできます。データはお使いのブラウザに保存されるため、他のユーザーに影響を与えません。ブラウザが変わるとマークは共有できませんのでご注意ください
			</p>
		</div>
	);
}

async function getBingoCard(bingoCardId: string) {
	const bingoCard = await prisma.bingoCardEntity.findUnique({
		where: { id: bingoCardId },
	});

	if (!bingoCard) {
		notFound();
	}

	return bingoCard;
}

async function BingoDetailContainer({
	bingoCardId,
}: {
	bingoCardId: Promise<string>;
}) {
	const resolvedBingoCardId = await bingoCardId;
	const bingoCard = await getBingoCard(resolvedBingoCardId);

	return <BingoDetailPresenter bingoCard={bingoCard} />;
}
