import { ReloadIcon } from '@radix-ui/react-icons';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { BingoCardEntity } from '@/app/generated/prisma';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import prisma from '@/lib/prisma';

export default async function CardDetailPage({
  params,
}: PageProps<'/views/[bingoGameViewId]/cards/[cardId]'>) {
  const { cardId } = await params;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-lg">
        <Suspense fallback={<ReloadIcon className="mx-auto p-8" />}>
          <BingoDetailContainer bingoCardId={cardId} />
        </Suspense>
      </div>
    </div>
  );
}

async function getBingoCard(bingoCardId: string) {
  const bingoCard = await prisma.bingoCardEntity.findUnique({
    where: { id: bingoCardId },
  });

  if (!bingoCard) {
    notFound();
  }

  return bingoCard;
}

async function BingoDetailContainer({ bingoCardId }: { bingoCardId: string }) {
  const bingoCard = await getBingoCard(bingoCardId);

  return <BingoDetailPresenter bingoCard={bingoCard} />;
}

function BingoDetailPresenter({ bingoCard }: { bingoCard: BingoCardEntity }) {
  return <BingoCard bingoCard={bingoCard} />;
}
