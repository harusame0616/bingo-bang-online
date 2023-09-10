import { BingoCardDto, FREE } from '../models/BingoCard';

const SIZE = 5;
export function isCardBingo(
  lotteryNumbers: number[],
  squares: BingoCardDto['squares'],
) {
  const hitNumbers = [FREE, ...lotteryNumbers];

  if (hitNumbers.length < SIZE) {
    return false;
  }

  // 横のチェック
  for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
    console.log('横', squares[rowIndex]);
    if (isLineBingo(hitNumbers, squares[rowIndex])) {
      return true;
    }
  }

  // 縦チェック
  for (let colIndex = 0; colIndex < SIZE; colIndex++) {
    const columnNumbers = Array.from(
      { length: SIZE },
      (_, i) => squares[i][colIndex],
    );
    console.log('縦', columnNumbers);
    if (isLineBingo(hitNumbers, columnNumbers)) {
      return true;
    }
  }

  // クロスチェック
  const leftTopToRightBottomNumbers = Array.from(
    { length: SIZE },
    (_, i) => squares[i][i],
  );
  console.log('左上から右下', leftTopToRightBottomNumbers);
  if (isLineBingo(hitNumbers, leftTopToRightBottomNumbers)) {
    return true;
  }

  const leftBottomToRightTop = Array.from(
    { length: SIZE },
    (_, i) => squares[i][SIZE - 1 - i],
  );
  console.log('左下から右上', leftBottomToRightTop);
  if (isLineBingo(hitNumbers, leftBottomToRightTop)) {
    return true;
  }

  return false;
}

function isLineBingo(lotteryNumbers: number[], line: number[]) {
  return line.every((number) => lotteryNumbers.includes(number));
}
