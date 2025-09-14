import { ReloadIcon } from "@radix-ui/react-icons";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BingoCardList } from "@/app/_components/bingo-card-list";
import { Heading } from "@/app/(noRobots)/_components/Heading";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { Section } from "@/components/BoxSection";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import { BingoCardGenerateUsecase } from "@/domains/BingoCard/usecases/BingoCardGenerate.usecase";
import { getRepository } from "@/lib/infra/getRepository";
import prisma from "@/lib/prisma";

import { BingoCardDeleteButton } from "../_components/BingoCardDeleteButton";
import BingoCardGenerationForm from "../_components/BingoCardGenerationForm";

async function generateBingoCard(formData: FormData) {
	"use server";

	const bingoGameId = formData.get("bingoGameId");
	const cardName = formData.get("bingoCardName");

	if (!bingoGameId) {
		throw new Error("bingoGameId is required");
	}

	if (typeof bingoGameId !== "string") {
		throw new Error("bingoGameId is invalid type");
	}

	if (typeof cardName !== "string") {
		throw new Error("cardName is invalid type");
	}

	const bingoCardGenerateUsecase = new BingoCardGenerateUsecase({
		bingoCardRepository: getRepository("bingoCard"),
		bingoGameRepository: getRepository("bingoGame"),
	});

	await bingoCardGenerateUsecase.execute(bingoGameId, {
		name: cardName,
	});

	revalidatePath("/game/[bingoGameId]/bing-cards");
}

export default async function NextPage({
	params,
}: PageProps<"/games/[bingoGameId]/cards">) {
	const { bingoGameId } = await params;

	return (
		<article>
			<Section>
				<Heading>ビンゴカード生成</Heading>
				<BingoCardGenerationForm
					action={generateBingoCard}
					bingoGameId={bingoGameId}
					canGenerate={true}
				/>
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
		</article>
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

export async function BingoCardsContainer({
	bingoGameId,
}: {
	bingoGameId: string;
}) {
	const { bingoCards, lotteryNumbers } = await getBingoGame(bingoGameId);

	return (
		<BingoCardsPresenter
			bingoCards={bingoCards}
			lotteryNumbers={lotteryNumbers}
		/>
	);
}

export function BingoCardsPresenter({
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
					<BingoCardDeleteButton
						bingoCardId={bingoCard.id}
						bingoCardName={bingoCard.name || "名無し"}
					/>
				</li>
			))}
		</BingoCardList>
	);
}
