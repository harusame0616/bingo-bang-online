'use client';

import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { BingoCardEntity } from '@/app/generated/prisma';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { FREE } from '@/domains/BingoCard/models/BingoCard';

const hitNumbersAtom = atomWithStorage<Record<string, number[]>>(
  'hit-numbers',
  {},
);

export function BingoDetailPresenter({
  bingoCard,
}: {
  bingoCard: BingoCardEntity;
}) {
  const [cardHitNumbers, setHitNumbers] = useAtom(hitNumbersAtom);

  function handleNumberClick(number: number) {
    if (number === FREE) {
      return;
    }

    setHitNumbers((previous) => {
      const oldHitNumbers = previous[bingoCard.id] || [];
      const index = oldHitNumbers.findIndex((v) => v === number);

      if (index >= 0) {
        return {
          ...previous,
          [bingoCard.id]: oldHitNumbers.toSpliced(index, 1),
        };
      } else {
        return {
          ...previous,
          [bingoCard.id]: [...oldHitNumbers, number],
        };
      }
    });
  }

  return (
    <BingoCard
      bingoCard={bingoCard}
      onNumberClick={handleNumberClick}
      lotteryNumbers={cardHitNumbers[bingoCard.id] || []}
    />
  );
}
