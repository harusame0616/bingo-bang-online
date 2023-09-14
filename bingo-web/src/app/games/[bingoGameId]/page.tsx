import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

type Props = {
  params: {
    bingoGameId: string;
  };
};

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
      <div className="flex justify-center w-full">
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

      <div className="w-full max-w-screen-lg mx-auto my-4">
        <div className="flex flex-col items-center gap-2 w-full max-w-screen-lg mx-auto">
          <div className="w-full flex justify-end text-xs text-primary-lighter mt-8">
            <Link href={`/views/${bingoGame.viewId}/lottery_numbers`}>
              抽選番号発表ページ
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 w-full max-w-screen-lg mx-auto mb-8">
        {bingoGame.lotteryNumbers.map((lotteryNumber) => (
          <Chip key={lotteryNumber}>{lotteryNumber}</Chip>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 w-full max-w-screen-lg mx-auto my-4">
        <BingoCardGenerationForm
          action={generateDomainCard}
          bingoGameId={bingoGameId}
          canGenerate={canBingoCardGenerate()}
        />
        <div className="w-full flex justify-end text-xs text-primary-lighter">
          <Link href={`/views/${bingoGame.viewId}/cards`}>
            カード一覧ページ
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-screen-xl mx-auto">
        {bingoGame.bingoCards.map((bingoCard) => (
          <div key={bingoCard.id}>
            <BingoCard
              bingoCard={bingoCard}
              lotteryNumbers={bingoGame.lotteryNumbers}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
