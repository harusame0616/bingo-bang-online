import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import { FREE } from '@/domains/BingoCard/models/BingoCard';
import { BingoCardDeleteUsecase } from '@/domains/BingoCard/usecases/BingoCardDelete.usecase';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import { BINGO_CARD_MAX_COUNT } from '@/domains/BingoGame/models/BingoGame';
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
    return bingoGame.bingoCards.length === BINGO_CARD_MAX_COUNT;
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

      <div className="flex flex-wrap gap-2 w-full max-w-screen-lg mx-auto my-8">
        {bingoGame.lotteryNumbers.map((lotteryNumber) => (
          <div
            className="flex justify-center w-16 rounded-lg bg-primary-lighten text-primary-darken"
            key={lotteryNumber}
          >
            {lotteryNumber}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 w-full max-w-screen-lg mx-auto my-4">
        <BingoCardGenerationForm
          action={generateDomainCard}
          bingoGameId={bingoGameId}
          canGenerate={canBingoCardGenerate()}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-screen-xl mx-auto">
        {bingoGame.bingoCards.map((bingoCard) => (
          <div key={bingoCard.id}>
            <div>{bingoCard.name || '名無しのカード'}</div>
            <div>
              {bingoCard.squares.map((rows, ri) => (
                <div key={ri} className="flex">
                  {rows.map((number, ci) => (
                    <div
                      key={`${ri}${ci}`}
                      className={`w-8 h-8 md:h-12 md:w-12 border border-primary-darken rounded-sm ${
                        isCardBingo(bingoGame.lotteryNumbers, bingoCard.squares)
                          ? 'border-red-600'
                          : 'border-gray-500'
                      }`}
                    >
                      <div
                        className={`w-full h-full flex justify-center items-center ${
                          [...bingoGame.lotteryNumbers, FREE].includes(number)
                            ? 'bg-primary-lighten text-red-600'
                            : ''
                        }`}
                      >
                        {number}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div>
              <form action={deleteBingoCard}>
                <input
                  type="text"
                  name="bingoGameId"
                  hidden
                  defaultValue={bingoGameId}
                />
                <input
                  type="text"
                  name="bingoCardId"
                  hidden
                  defaultValue={bingoCard.id}
                />
                <button>delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
