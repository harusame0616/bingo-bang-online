import { PageBox } from '@/components/BoxPageContent';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { getQuery } from '@/lib/infra/getQuery';

import { BingoCardDetailPageQueryUsecase } from './BingoCardDetailPageQueryUsecase';

interface Props {
  params: {
    bingoGameViewId: string;
    cardId: string;
  };
}

function getBingoCard(bingoCardId: string) {
  const bingoCardDetailPageQueryUsecase = new BingoCardDetailPageQueryUsecase(
    getQuery('bingoCard'),
  );

  return bingoCardDetailPageQueryUsecase.execute(bingoCardId);
}

export default async function CardDetailPage({ params: { cardId } }: Props) {
  const bingoCard = await getBingoCard(cardId);

  return (
    <PageBox>
      <article className="flex flex-col items-center">
        <h2 className="mb-4 text-lg text-primary-darken">
          {bingoCard.name || '名無しのカード'}
        </h2>
        <div className="grid w-full max-w-md grid-cols-1">
          <BingoCard bingoCard={bingoCard} noLabel />
        </div>
      </article>
    </PageBox>
  );
}
