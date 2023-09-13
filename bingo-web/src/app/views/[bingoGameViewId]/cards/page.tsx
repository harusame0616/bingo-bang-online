import { notFound } from 'next/navigation';

import { Button } from '@/components/Button';
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

  if (bingoGameViewDto.bingoCards.length === 0) {
    return (
      <div className="text-center max-w-screen-lg mx-auto">
        ビンゴカードが登録されていません。
        <br /> 管理ページでビンゴカードを登録してください。
        <form>
          <Button>更新</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-8 max-w-screen-lg w-full mx-auto justify-center">
      {bingoGameViewDto.bingoCards.map((bingoCard) => (
        <BingoCard key={bingoCard.id} bingoCard={bingoCard} />
      ))}
    </div>
  );
}
