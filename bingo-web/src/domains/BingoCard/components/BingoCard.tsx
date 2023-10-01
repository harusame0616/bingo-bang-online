import { useId } from 'react';

import { Card } from '@/components/ui/card';

import { BingoCardDto, FREE } from '../models/BingoCard';

type Props = {
  bingoCard: BingoCardDto | Omit<BingoCardDto, 'bingoGameId'>;
  lotteryNumbers?: number[];
  noLabel?: boolean;
} & {
  large?: boolean;
};

export function BingoCard({
  bingoCard,
  large,
  lotteryNumbers,
  noLabel,
}: Props) {
  const squareSize = large ? 12 : 8;
  const labelSize = squareSize * 4 * 5;
  const bingoCardId = useId();

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
          {bingoCard.squares.map((rows, ri) => (
            <li key={ri} aria-label={`ビンゴカード${ri + 1}段目`}>
              <ul className="grid grid-cols-5">
                {rows.map((number, ci) => (
                  <li
                    key={`${ri}${ci}`}
                    className={`relative flex h-0 grow-0 border border-gray-200 pb-[100%] ${
                      lotteryNumbers &&
                      lotteryNumbers &&
                      [...lotteryNumbers, FREE].includes(number)
                        ? 'bg-primary text-red-600'
                        : ''
                    }`}
                  >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      {number === FREE ? (
                        <span className="text-xs text-red-600">FREE</span>
                      ) : (
                        number
                      )}
                    </div>
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
