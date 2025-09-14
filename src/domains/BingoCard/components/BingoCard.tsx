'use client';

import { useId } from 'react';

import { BingoCardEntity } from '@/app/generated/prisma';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { FREE } from '../models/BingoCard';

type Props = {
  bingoCard: BingoCardEntity;
  lotteryNumbers?: number[];
  noLabel?: boolean;
  onNumberClick?: (number: number) => void;
} & {
  large?: boolean;
};

export function BingoCard({
  bingoCard,
  large,
  lotteryNumbers,
  noLabel,
  onNumberClick,
}: Props) {
  const squareSize = large ? 12 : 8;
  const labelSize = squareSize * 4 * 5;
  const bingoCardId = useId();
  const squares = [
    bingoCard.squares.slice(0, 5),
    bingoCard.squares.slice(5, 10),
    bingoCard.squares.slice(10, 15),
    bingoCard.squares.slice(15, 20),
    bingoCard.squares.slice(20, 25),
  ];

  return (
    <Card className="p-2">
      <figure>
        <figcaption
          id={bingoCardId}
          className={
            `max-w-[${labelSize}px] overflow-hidden text-ellipsis pb-1 text-sm` +
            (noLabel ? 'sr-only' : '')
          }
        >
          {bingoCard.name || '名無しのカード'}
        </figcaption>
        <ul aria-labelledby={bingoCardId}>
          {squares.map((rows, ri) => (
            <li key={ri} aria-label={`ビンゴカード${ri + 1}段目`}>
              <ul className="grid grid-cols-5">
                {rows.map((number, ci) => (
                  <li
                    key={`${ri}${ci}`}
                    className={cn(
                      'relative flex h-0 grow-0 border border-gray-200 pb-[100%]',
                      lotteryNumbers &&
                        [...lotteryNumbers, FREE].includes(number) &&
                        'bg-primary text-red-600',
                    )}
                  >
                    <button
                      className={cn("absolute inset-0", !onNumberClick && 'pointer-events-none')}
                      onClick={onNumberClick?.bind(null, number)}
                    >
                      {number === FREE ? (
                        <span className="text-xs text-red-600">FREE</span>
                      ) : (
                        number
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </figure>
    </Card>
  );
}
