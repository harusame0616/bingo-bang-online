import { useId } from 'react';

import { Card } from '@/components/ui/card';

import { isCardBingo } from '../lib/isCardBingo';
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
  // tailwind のクラス検出用コメント -> h-12 w-12 h-8 w-8
  const squareSizeStyle = `h-${squareSize} w-${squareSize}`;
  const bingoCardId = useId();

  return (
    <Card className="p-2">
      <figure>
        <figcaption
          id={bingoCardId}
          className={
            `max-w-[${labelSize}px] overflow-hidden text-ellipsis pb-1` +
            (noLabel ? 'sr-only' : '')
          }
        >
          {bingoCard.name || '名無しのカード'}
        </figcaption>
        <ul aria-labelledby={bingoCardId}>
          {bingoCard.squares.map((rows, ri) => (
            <li key={ri} aria-label={`ビンゴカード${ri + 1}段目`}>
              <ul className="flex">
                {rows.map((number, ci) => (
                  <li
                    key={`${ri}${ci}`}
                    className={`grow-0 border border-gray-200 ${squareSizeStyle} ${
                      lotteryNumbers &&
                      isCardBingo(lotteryNumbers, bingoCard.squares)
                        ? 'border-red-600'
                        : ''
                    }`}
                  >
                    <div
                      className={`flex h-full w-full items-center justify-center ${
                        lotteryNumbers &&
                        [...lotteryNumbers, FREE].includes(number)
                          ? 'bg-primary text-red-600'
                          : ''
                      }`}
                    >
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
