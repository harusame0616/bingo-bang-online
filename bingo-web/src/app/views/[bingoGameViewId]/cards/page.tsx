import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/Button';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { getQuery } from '@/lib/getQuery';

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

  if (bingoGameViewDto.bingoCards.length === 0) {
    return (
      <div className="mx-auto max-w-screen-lg text-center">
        ビンゴカードが登録されていません。
        <br /> 管理ページでビンゴカードを登録してください。
        <form>
          <Button>更新</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-wrap justify-center gap-8">
      {bingoGameViewDto.bingoCards.map((bingoCard) => (
        <div key={bingoCard.id}>
          <BingoCard bingoCard={bingoCard} />
          <Link href={`/views/${bingoGameViewId}/cards/${bingoCard.id}`}>
            閲覧ページ
          </Link>
        </div>
      ))}
    </div>
  );
}
