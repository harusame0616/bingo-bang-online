import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { BingoCard } from '@/domains/BingoCard/components/BingoCard';
import { BingoCardDeleteUsecase } from '@/domains/BingoCard/usecases/BingoCardDelete.usecase';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
// import { BINGO_CARD_MAX_COUNT } from '@/domains/BingoGame/models/BingoGame';
import { BingoGameDrawLotteryNumberUsecase } from '@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase';
import { BingoGameFindOneWithCardsQueryUsecase } from '@/domains/BingoGame/usecases/BingoGameFindOneWithCards.query-usecase';
import { getQuery } from '@/lib/getQuery';
import { getRepository } from '@/lib/getRepository';

import BingoCardGenerationForm from './_components/BingoCardGenerationForm';
import LotteryRoulette from './_components/LotteryRoulette';

interface Props {
  params: {
    bingoGameId: string;
  };
}

async function drawLotteryNumber(formData: FormData) {
  'use server';

  const bingoGameId = formData.get('bingoGameId');

  if (!bingoGameId) {
    throw new Error('bingoGameId is required');
  }

  if (typeof bingoGameId !== 'string') {
    throw new Error('bingoGameId is invalid type');
  }

  const drawLotteryNumberUsecase = new BingoGameDrawLotteryNumberUsecase(
    getRepository('bingoGame'),
  );
  await drawLotteryNumberUsecase.execute(bingoGameId);
  revalidatePath('/game/[bingoGameId]');
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

  return (
    <div>
      <div className="flex w-full justify-center">
        <form action={drawLotteryNumber}>
          <input
            type="text"
            name="bingoGameId"
            hidden
            defaultValue={bingoGameId}
          />
          <LotteryRoulette
            number={bingoGame.lotteryNumbers.slice(-1)[0] ?? 0}
          />
        </form>
      </div>

      <div className="mx-auto my-4 w-full max-w-screen-lg">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-2">
          <div className="mt-8 flex w-full justify-end text-xs text-primary-lighter">
            <Link href={`/views/${bingoGame.viewId}/lottery_numbers`}>
              抽選番号発表ページ
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-8 flex w-full max-w-screen-lg flex-wrap gap-2">
        {bingoGame.lotteryNumbers.map((lotteryNumber) => (
          <Chip key={lotteryNumber}>{lotteryNumber}</Chip>
        ))}
      </div>

      <div className="mx-auto my-4 flex w-full max-w-screen-lg flex-col items-center gap-2">
        <BingoCardGenerationForm
          action={generateDomainCard}
          bingoGameId={bingoGameId}
          canGenerate={canBingoCardGenerate()}
        />
        <div className="flex w-full justify-end text-xs text-primary-lighter">
          <Link href={`/views/${bingoGame.viewId}/cards`}>
            カード一覧ページ
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-8">
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
    </div>
  );
}
