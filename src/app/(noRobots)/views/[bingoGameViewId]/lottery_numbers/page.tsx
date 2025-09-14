import { Pacifico } from 'next/font/google';

import { LotteryHistory } from '@/app/(noRobots)/_components/LotteryHistory';
import { Section } from '@/components/BoxSection';
import { Button } from '@/components/Button';
import { getQuery } from '@/lib/infra/getQuery';

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });

async function getLotteryNumbers(bingoGameViewId: string) {
  const repository = getQuery('bingoGame');

  const { lotteryNumbers } =
    await repository.findOneByViewIdWithCards(bingoGameViewId);

  return lotteryNumbers;
}

export default async function Page({
  params,
}: PageProps<'/views/[bingoGameViewId]/lottery_numbers'>) {
  const { bingoGameViewId } = await params;
  const lotteryNumbers = await getLotteryNumbers(bingoGameViewId);

  return (
    <div>
      <LastLotteryNumber lotteryNumber={lotteryNumbers.slice(-1)[0] ?? '-'} />
      <LotteryHistory lotteryNumbers={lotteryNumbers} />
    </div>
  );
}

function LastLotteryNumber({ lotteryNumber }: { lotteryNumber: number }) {
  return (
    <Section>
      <h2
        className="mb-2 text-center text-xs text-primary-darken"
        id="lottery-history"
      >
        最終抽選番号
      </h2>
      <div className="flex flex-col items-center">
        <div
          className={`-mt-20 text-[10rem] text-primary-darken ${numberFont.className}`}
        >
          {lotteryNumber ?? '-'}
        </div>
      </div>
      <form className="-mt-4 flex justify-center" method="GET">
        <Button>再読み込み</Button>
      </form>
    </Section>
  );
}
