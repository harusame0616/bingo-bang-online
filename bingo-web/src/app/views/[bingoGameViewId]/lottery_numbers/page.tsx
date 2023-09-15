import { Pacifico } from '@next/font/google';
import { notFound } from 'next/navigation';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { getQuery } from '@/lib/getQuery';

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });
interface Props {
  params: {
    bingoGameViewId: string;
  };
}

export default async function Page({ params: { bingoGameViewId } }: Props) {
  const repository = getQuery('bingoGame');
  const bingoGameViewDto =
    await repository.findOneByViewIdWithCards(bingoGameViewId);

  if (!bingoGameViewDto) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <h1 className="mb-8 text-center text-2xl text-primary-darken">
        抽選番号発表
      </h1>
      <div className="flex flex-col items-center">
        <div className="text-xs text-primary-lighter">最終抽選番号</div>
        <div
          className={`-mt-12 text-[10rem] text-primary-darken ${numberFont.className}`}
        >
          {bingoGameViewDto.lotteryNumbers.slice(-1)[0] ?? '-'}
        </div>
      </div>
      <form className="mb-8 flex justify-center">
        <Button thick>再読み込み</Button>
      </form>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-t-primary-darken py-4">
        {bingoGameViewDto.lotteryNumbers.map((number) => (
          <Chip key={number}>{number}</Chip>
        ))}
      </div>
    </div>
  );
}
