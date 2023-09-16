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
    <div className="mx-auto flex max-w-screen-lg justify-center">
      <BingoCard key={bingoCard.id} bingoCard={bingoCard} large />
    </div>
  );
}
