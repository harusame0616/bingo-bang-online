import { notFound } from 'next/navigation';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { getQuery } from '@/lib/getQuery';

type Props = {
  params: {
    bingoGameViewId: string;
  };
};

export default async function Page({ params: { bingoGameViewId } }: Props) {
  const repository = getQuery('bingoGame');
  const bingoGameViewDto =
    await repository.findOneByViewIdWithCards(bingoGameViewId);

  if (!bingoGameViewDto) {
    return notFound();
  }

  return (
    <div className="max-w-screen-lg w-full mx-auto">
      <h1 className="text-center mb-8 text-2xl text-primary-darken">
        抽選番号発表
      </h1>
      <div className="flex flex-col items-center">
        <div className="text-xs text-primary-lighter">最終抽選番号</div>
        <div className="text-primary-darken text-[10rem] -mt-12">
          {bingoGameViewDto.lotteryNumbers.slice(-1)[0] ?? '-'}
        </div>
      </div>
      <form className="flex justify-center mb-8">
        <Button thick>再読み込み</Button>
      </form>

      <div className="flex gap-x-4 gap-y-2 flex-wrap justify-center border-t py-4 border-t-primary-darken">
        {bingoGameViewDto.lotteryNumbers.map((number) => (
          <Chip key={number}>{number}</Chip>
        ))}
      </div>
    </div>
  );
}
