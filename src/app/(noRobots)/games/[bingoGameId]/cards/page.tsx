import { ReloadIcon } from '@radix-ui/react-icons';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';

import { Heading } from '@/app/(noRobots)/_components/Heading';
import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';
import { getRepository } from '@/lib/infra/getRepository';

import { BingoCardDeleteButton } from '../_components/BingoCardDeleteButton';
import BingoCardGenerationForm from '../_components/BingoCardGenerationForm';

async function generateBingoCard(formData: FormData) {
  'use server';

  const bingoGameId = formData.get('bingoGameId');
  const cardName = formData.get('bingoCardName');

  if (!bingoGameId) {
    throw new Error('bingoGameId is required');
  }

  if (typeof bingoGameId !== 'string') {
    throw new Error('bingoGameId is invalid type');
  }

  if (typeof cardName !== 'string') {
    throw new Error('cardName is invalid type');
  }

  const bingoCardGenerateUsecase = new BingoCardGenerateUsecase({
    bingoCardRepository: getRepository('bingoCard'),
    bingoGameRepository: getRepository('bingoGame'),
  });

  await bingoCardGenerateUsecase.execute(bingoGameId, {
    name: cardName,
  });

  revalidatePath('/game/[bingoGameId]/bing-cards');
}

interface Props {
  params: {
    bingoGameId: string;
  };
}

export default async function BingoCardManagementPage({
  params: { bingoGameId },
}: Props) {
  return (
    <PageBox>
      <article>
        <Section>
          <Heading>ビンゴカード生成</Heading>
          <BingoCardGenerationForm
            action={generateBingoCard}
            bingoGameId={bingoGameId}
            canGenerate={true}
          />
        </Section>
        <Section>
          <Heading>ビンゴカードリスト</Heading>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
              </div>
            }
          >
            <BingoCards bingoGameId={bingoGameId} />
          </Suspense>
        </Section>
      </article>
    </PageBox>
  );
}

function getBingoGame(bingoGameId: string) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );

  return bingoGameQueryUsecase.execute(bingoGameId);
}

async function BingoCards({ bingoGameId }: { bingoGameId: string }) {
  const { bingoCards, lotteryNumbers } = await getBingoGame(bingoGameId);

  return (
    <ul aria-label="ビンゴカード" className="w-full">
      <div className="grid grid-cols-2 gap-x-4  gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {bingoCards.map((bingoCard) => (
          <li key={bingoCard.id} aria-level={1}>
            <BingoCard bingoCard={bingoCard} lotteryNumbers={lotteryNumbers} />
            <BingoCardDeleteButton
              bingoCardId={bingoCard.id}
              bingoCardName={bingoCard.name || '名無し'}
            />
          </li>
        ))}
      </div>
    </ul>
  );
}
