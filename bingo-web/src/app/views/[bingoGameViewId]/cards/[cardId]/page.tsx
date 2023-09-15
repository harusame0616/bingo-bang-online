import { notFound } from 'next/navigation';

import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { getQuery } from '@/lib/getQuery';

import { BingoCardDetailPageQueryUsecase } from './BingoCardDetailPageQueryUsecase';

interface Props {
  params: {
    bingoGameViewId: string;
    cardId: string;
  };
}

export default async function CardDetailPage({ params: { cardId } }: Props) {
  const bingoCardDetailPageQueryUsecase = new BingoCardDetailPageQueryUsecase(
    getQuery('bingoCard'),
  );

  const bingoCard = await bingoCardDetailPageQueryUsecase.execute(cardId);

  if (!bingoCard) {
    return notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-wrap justify-center gap-8">
      <BingoCard key={bingoCard.id} bingoCard={bingoCard} />
    </div>
  );
}
