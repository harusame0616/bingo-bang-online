import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import {
  BingoCardDto,
  LOTTERY_NUMBER_MAX,
} from '@/domains/BingoCard/models/BingoCard';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';
import { getRepository } from '@/lib/infra/getRepository';

import { Heading } from '../../_components/Heading';
import { LotteryHistory } from '../../_components/LotteryHistory';
import { BingoCardDeleteButton } from './_components/BingoCardDeleteButton';
import BingoCardGenerationForm from './_components/BingoCardGenerationForm';
import LotteryRoulette from './_components/LotteryRoulette';

interface Props {
  params: {
    bingoGameId: string;
  };
}

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

  revalidatePath('/game/[bingoGameId]');
}

function getBingoGame(bingoGameId: string) {
  const bingoGameQueryUsecase = new BingoGameFindOneWithCardsQueryUsecase(
    getQuery('bingoGame'),
  );

  return bingoGameQueryUsecase.execute(bingoGameId);
}

export default async function BingoGameManagementPage({
  params: { bingoGameId },
}: Props) {
  const { bingoCards, lotteryNumbers, viewId } =
    await getBingoGame(bingoGameId);

  return (
    <PageBox>
      <article>
        <LotteryResult
          bingoGameId={bingoGameId}
          lotteryNumbers={lotteryNumbers}
        />
        <LotteryHistory lotteryNumbers={lotteryNumbers} />
        <BingoCompletionCards
          bingoCards={bingoCards}
          lotteryNumbers={lotteryNumbers}
        />
        <BingoGameGeneration bingoGameId={bingoGameId} />
        <BingoCards bingoCards={bingoCards} lotteryNumbers={lotteryNumbers} />
        <ViewLinks viewId={viewId} />
      </article>
    </PageBox>
  );
}

function LotteryResult({
  bingoGameId,
  lotteryNumbers,
}: {
  bingoGameId: string;
  lotteryNumbers: number[];
}) {
  return (
    <Section>
      <Heading>抽選結果</Heading>
      <LotteryRoulette
        bingoGameId={bingoGameId}
        number={lotteryNumbers.slice(-1)[0]}
        finish={lotteryNumbers.length === LOTTERY_NUMBER_MAX}
      />
    </Section>
  );
}

function BingoGameGeneration({ bingoGameId }: { bingoGameId: string }) {
  return (
    <Section>
      <Heading>ビンゴカード生成</Heading>
      <BingoCardGenerationForm
        action={generateBingoCard}
        bingoGameId={bingoGameId}
        canGenerate={true}
      />
    </Section>
  );
}

function BingoCompletionCards({
  bingoCards,
  lotteryNumbers,
}: {
  bingoCards: BingoCardDto[];
  lotteryNumbers: number[];
}) {
  const bingoCompleteCards = bingoCards
    .filter((bingoCard) => isCardBingo(lotteryNumbers, bingoCard.squares))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Section>
      <Heading>
        <span id="bingo-complete-card-name-list">
          ビンゴ完成カード名一覧(名前順)
        </span>
      </Heading>
      <ol
        aria-labelledby="bingo-complete-card-name-list"
        className="flex flex-wrap justify-center gap-x-4"
      >
        {bingoCompleteCards.map(({ id, name }) => (
          <li key={id}>{name || '名無しのカード'}</li>
        ))}
      </ol>
    </Section>
  );
}

function BingoCards({
  bingoCards,
  lotteryNumbers,
}: {
  bingoCards: BingoCardDto[];
  lotteryNumbers: number[];
}) {
  return (
    <Section>
      <Heading>
        <span id="bingo-cards">ビンゴカード一覧</span>
      </Heading>
      <ul aria-labelledby="bingo-cards">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-8">
          {bingoCards.map((bingoCard) => (
            <li key={bingoCard.id} aria-level={1}>
              <div className="mb-1">
                <BingoCard
                  bingoCard={bingoCard}
                  lotteryNumbers={lotteryNumbers}
                />
              </div>
              <BingoCardDeleteButton
                bingoCardId={bingoCard.id}
                bingoCardName={bingoCard.name || '名無し'}
              />
            </li>
          ))}
        </div>
      </ul>
    </Section>
  );
}

function ViewLinks({ viewId }: { viewId: string }) {
  return (
    <Section>
      <h2
        className="mb-2 text-center text-xs text-primary-darken "
        id="view-pages"
      >
        閲覧専用ページリンク
      </h2>
      <ul aria-labelledby="view-pages">
        <li>
          <Link
            href={`/views/${viewId}/lottery_numbers`}
            className="block text-center text-xs italic text-primary-lighter underline hover:text-primary-darken"
          >
            抽選番号発表ページ
          </Link>
        </li>
        <li>
          <Link
            href={`/views/${viewId}/cards`}
            className="block text-center text-xs italic text-primary-lighter underline hover:text-primary-darken"
          >
            カード一覧ページ
          </Link>
        </li>
      </ul>
    </Section>
  );
}
