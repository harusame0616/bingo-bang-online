import { isCardBingo } from '../lib/isCardBingo';
import { BingoCardDto, FREE } from '../models/BingoCard';

type Props = {
  bingoCard: BingoCardDto | Omit<BingoCardDto, 'bingoGameId'>;
  lotteryNumbers?: number[];
} & {
  large?: boolean;
};

export function BingoCard({ bingoCard, large, lotteryNumbers }: Props) {
  const squareSize = large ? 'h-12 w-12' : 'h-8 w-8';

  return (
    <div>
      <div>{bingoCard.name || '名無しのカード'}</div>
      <div>
        {bingoCard.squares.map((rows, ri) => (
          <div key={ri} className="flex">
            {rows.map((number, ci) => (
              <div
                key={`${ri}${ci}`}
                className={`rounded-sm border border-primary-darken ${squareSize} ${
                  lotteryNumbers &&
                  isCardBingo(lotteryNumbers, bingoCard.squares)
                    ? 'border-red-600'
                    : 'border-gray-500'
                }`}
              >
                <div
                  className={`flex h-full w-full items-center justify-center ${
                    lotteryNumbers && [...lotteryNumbers, FREE].includes(number)
                      ? 'bg-primary-lighten text-red-600'
                      : ''
                  }`}
                >
                  {number === FREE ? (
                    <span className="text-xs text-red-600">FREE</span>
                  ) : (
                    number
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
