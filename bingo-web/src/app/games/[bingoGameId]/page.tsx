import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageBox } from '@/components/BoxPageContent';
import { Section } from '@/components/BoxSection';
import { Chip } from '@/components/Chip';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/infra/getQuery';
import { getRepository } from '@/lib/infra/getRepository';

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

export default async function BingoGameManagementPage({
  params: { bingoGameId },
}: Props) {
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
        <div
          className="mb-2 text-center text-xs text-primary-darken"
          id="lottery-number-history"
        >
          抽選番号履歴
        </div>
        <ol aria-labelledby="lottery-number-history">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {bingoGame.lotteryNumbers.map((lotteryNumber) => (
              <li key={lotteryNumber}>
                <Chip>{lotteryNumber}</Chip>
              </li>
            ))}
          </div>
        </ol>
      </Section>

      <Section>
        <BingoCardGenerationForm
          action={generateBingoCard}
          bingoGameId={bingoGameId}
          canGenerate={canBingoCardGenerate()}
        />
      </Section>

      <Section>
        <div
          className="mb-2 text-center text-xs text-primary-darken"
          id="bingo-complete-card-name-list"
        >
          ビンゴ完成カード名一覧(名前順)
        </div>
        <ol aria-labelledby="bingo-complete-card-name-list">
          <div className="flex flex-wrap justify-center gap-x-4">
            {bingoCompleteCards.map(({ id, name }) => (
              <li key={id}>{name || '名無しのカード'}</li>
            ))}
          </div>
        </ol>
      </Section>
      <Section>
        <div
          className="mb-2 text-center text-xs text-primary-darken "
          id="bingo-cards"
        >
          ビンゴカード一覧
        </div>
        <ul aria-labelledby="bingo-cards">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-8">
            {bingoGame.bingoCards.map((bingoCard) => (
              <li key={bingoCard.id} aria-level={1}>
                <div className="mb-1">
                  <BingoCard
                    bingoCard={bingoCard}
                    lotteryNumbers={bingoGame.lotteryNumbers}
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
      <Section>
        <div
          className="mb-2 text-center text-xs text-primary-darken "
          id="view-pages"
        >
          閲覧専用ページリンク
        </div>
        <ul aria-labelledby="view-pages">
          <li>
            <Link
              href={`/views/${bingoGame.viewId}/lottery_numbers`}
              className="block text-center text-xs italic text-primary-lighter underline hover:text-primary-darken"
            >
              抽選番号発表ページ
            </Link>
          </li>
          <li>
            <Link
              href={`/views/${bingoGame.viewId}/cards`}
              className="block text-center text-xs italic text-primary-lighter underline hover:text-primary-darken"
            >
              カード一覧ページ
            </Link>
          </li>
        </ul>
      </Section>
    </PageBox>
  );
}
