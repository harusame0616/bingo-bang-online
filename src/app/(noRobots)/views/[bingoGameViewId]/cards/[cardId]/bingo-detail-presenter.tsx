"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import type { BingoCardEntity } from "@/app/generated/prisma";
import { BingoCard } from "@/domains/BingoCard/components/BingoCard";
import { FREE } from "@/domains/BingoCard/models/BingoCard";

const hitNumbersAtom = atomWithStorage<Record<string, number[]>>(
	"hit-numbers",
	{},
);

function useNumberMark(bingoCardId: string) {
	const [cardHitNumbers, setHitNumbers] = useAtom(hitNumbersAtom);

	const mark = useCallback(
		(number: number) => {
			if (number === FREE) {
				return;
			}

			setHitNumbers((previous) => {
				const oldHitNumbers = previous[bingoCardId] || [];
				const index = oldHitNumbers.indexOf(number);

				if (index >= 0) {
					return {
						...previous,
						[bingoCardId]: oldHitNumbers.toSpliced(index, 1),
					};
				}

				return {
					...previous,
					[bingoCardId]: [...oldHitNumbers, number],
				};
			});
		},
		[setHitNumbers, bingoCardId],
	);

	return {
		mark,
		get markedNumbers() {
			return cardHitNumbers[bingoCardId] || [];
		},
	};
}

export function BingoDetailPresenter({
	bingoCard,
}: {
	bingoCard: BingoCardEntity;
}) {
	const { mark, markedNumbers } = useNumberMark(bingoCard.bingoGameId);

	return (
		<BingoCard
			bingoCard={bingoCard}
			onNumberClick={mark}
			lotteryNumbers={markedNumbers}
		/>
	);
}
