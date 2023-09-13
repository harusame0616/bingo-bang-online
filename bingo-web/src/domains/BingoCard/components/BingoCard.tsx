import { isCardBingo } from '../lib/isCardBingo';
import { BingoCardDto, FREE } from '../models/BingoCard';

type Props = {
  bingoCard: BingoCardDto | Omit<BingoCardDto, 'id'>;
  lotteryNumbers?: number[];
};
export function BingoCard({ bingoCard, lotteryNumbers }: Props) {
  return (
    <div>
      <div>{bingoCard.name || '名無しのカード'}</div>
      <div>
        {bingoCard.squares.map((rows, ri) => (
          <div key={ri} className="flex">
            {rows.map((number, ci) => (
              <div
                key={`${ri}${ci}`}
                className={`w-8 h-8 md:h-12 md:w-12 border border-primary-darken rounded-sm ${
                  lotteryNumbers &&
                  isCardBingo(lotteryNumbers, bingoCard.squares)
                    ? 'border-red-600'
                    : 'border-gray-500'
                }`}
              >
                <div
                  className={`w-full h-full flex justify-center items-center ${
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
