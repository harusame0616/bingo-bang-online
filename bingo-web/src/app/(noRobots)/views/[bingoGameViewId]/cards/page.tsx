import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Heading } from '@/app/(noRobots)/_components/Heading';
import { PageBox } from '@/components/BoxPageContent';
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
    return BingoCardIsNotRegistered();
  }

  return (
    <PageBox>
      <article>
        <Heading>
          <span id="bingo-cards">ビンゴカード一覧</span>
        </Heading>
        <ul
          aria-labelledby="bingo-cards"
          className="flex flex-wrap justify-center gap-x-4 gap-y-8"
        >
          {bingoGameViewDto.bingoCards.map((bingoCard) => (
            <li key={bingoCard.id}>
              <BingoCard bingoCard={bingoCard} />
              <Link href={`/views/${bingoGameViewId}/cards/${bingoCard.id}`}>
                閲覧ページ
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </PageBox>
  );
}

function BingoCardIsNotRegistered() {
  return (
    <PageBox className="text-center">
      <article>
        <h2 className="mb-4 text-lg font-bold text-primary-darken">
          ビンゴカードが登録されていません
        </h2>
        <p> 管理ページでビンゴカードを登録してください。</p>
      </article>
    </PageBox>
  );
}
