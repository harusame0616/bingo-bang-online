import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';
import { BingoCardDeleteUsecase } from '@/domains/BingoCard/usecases/BingoCardDelete.usecase';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';
import { getRepository } from '@/lib/infra/getRepository';

import BingoCardGenerationForm from './_components/BingoCardGenerationForm';
import LotteryRoulette from './_components/LotteryRoulette';

interface Props {
  params: {
    bingoGameId: string;
  };
}

async function generateDomainCard(formData: FormData) {
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

  revalidatePath('/game/[bingoGameId]');
}

async function deleteBingoCard(formData: FormData) {
  'use server';

  const bingoGameId = formData.get('bingoGameId');
  const bingoCardId = formData.get('bingoCardId');

  if (typeof bingoGameId !== 'string') {
    throw new Error('bingoGameId is invalid type');
  }

  if (typeof bingoCardId !== 'string') {
    throw new Error('bingoGameId is invalid type');
  }

  const bingoCardDeleteUsecase = new BingoCardDeleteUsecase({
    bingoCardRepository: getRepository('bingoCard'),
    bingoGameRepository: getRepository('bingoGame'),
  });

  await bingoCardDeleteUsecase.execute(bingoGameId, bingoCardId);

  revalidatePath('/game/[bingoGameId]');
}

export default async function GameNewPage({ params: { bingoGameId } }: Props) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );
  const bingoGame = await bingoGameQueryUsecase.execute(bingoGameId);

  if (!bingoGame) {
    return notFound();
  }

  const canBingoCardGenerate = () => {
    // return bingoGame.bingoCards.length < BINGO_CARD_MAX_COUNT;
    return true;
  };

  const bingoCompleteCards = bingoGame.bingoCards
    .filter((bingoCard) =>
      isCardBingo(bingoGame.lotteryNumbers, bingoCard.squares),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageBox>
      <Section>
        <LotteryRoulette
          bingoGameId={bingoGameId}
          number={bingoGame.lotteryNumbers.slice(-1)[0]}
          finish={bingoGame.lotteryNumbers.length === LOTTERY_NUMBER_MAX}
        />
      </Section>

      <Section>
        <Link
          href={`/views/${bingoGame.viewId}/lottery_numbers`}
          className="mb-2 block  text-center text-xs text-primary-lighter"
        >
          抽選番号発表ページ
        </Link>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {bingoGame.lotteryNumbers.map((lotteryNumber, i) => (
            <Chip
              key={lotteryNumber}
              data-testid={`lottery_number_history_${i + 1}`}
            >
              {lotteryNumber}
            </Chip>
          ))}
        </div>
      </Section>

      <Section>
        <BingoCardGenerationForm
          action={generateDomainCard}
          bingoGameId={bingoGameId}
          canGenerate={canBingoCardGenerate()}
        />
      </Section>

      <Section>
        <ol aria-labelledby="bingo-complete-card-title">
          <div
            className="mb-2 text-center text-xs text-primary-lighter"
            id="bingo-complete-card-title"
          >
            ビンゴ完成カード一覧(名前順)
          </div>
          <div className="flex flex-wrap justify-center gap-x-4">
            {bingoCompleteCards.map(({ id, name }) => (
              <li key={id}>{name || '名無しのカード'}</li>
            ))}
          </div>
        </ol>
      </Section>
      <Section>
        <Link
          href={`/views/${bingoGame.viewId}/cards`}
          className="mb-2 block  text-center text-xs text-primary-lighter"
        >
          カード一覧ページ
        </Link>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8">
          {bingoGame.bingoCards.map((bingoCard) => (
            <div key={bingoCard.id}>
              <BingoCard
                bingoCard={bingoCard}
                lotteryNumbers={bingoGame.lotteryNumbers}
              />
              <form action={deleteBingoCard}>
                <input hidden defaultValue={bingoGameId} name="bingoGameId" />
                <input hidden defaultValue={bingoCard.id} name="bingoCardId" />
                <Button thick className="text-xs">
                  削除
                </Button>
              </form>
            </div>
          ))}
        </div>
      </Section>
    </PageBox>
  );
}
