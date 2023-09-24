import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageBox } from '@/components/BoxPageContent';
import { Button } from '@/components/Button';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { getQuery } from '@/lib/infra/getQuery';

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
      <PageBox className="text-center">
        ビンゴカードが登録されていません。
        <br /> 管理ページでビンゴカードを登録してください。
        <form>
          <Button>更新</Button>
        </form>
      </PageBox>
    );
  }

  return (
    <PageBox className="flex flex-wrap justify-center gap-x-4 gap-y-8">
      {bingoGameViewDto.bingoCards.map((bingoCard) => (
        <div key={bingoCard.id}>
          <BingoCard bingoCard={bingoCard} />
          <Link href={`/views/${bingoGameViewId}/cards/${bingoCard.id}`}>
            閲覧ページ
          </Link>
        </div>
      ))}
    </PageBox>
  );
}
