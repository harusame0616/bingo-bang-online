import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { isCardBingo } from '@/domains/BingoCard/lib/isCardBingo';
import { FREE } from '@/domains/BingoCard/models/BingoCard';
import { BingoCardGenerateUsecase } from '@/domains/BingoCard/usecases/BingoCardGenerate.usecase';
import {
  BINGO_CARD_MAX_COUNT,
  BingoGameStateEnum,
} from '@/domains/BingoGame/models/BingoGame';
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
      <h1>Bingo Game</h1>
      <div>{bingoGameId}</div>
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
        <div></div>
      </div>

      {bingoGame.state === BingoGameStateEnum.FINISHED ? (
        <div>抽選終了</div>
      ) : (
        <div>抽選中</div>
      )}
      <div className="flex flex-wrap gap-8">
        {bingoGame.lotteryNumbers.map((lotteryNumber) => (
          <div key={lotteryNumber}>{lotteryNumber}</div>
        ))}
      </div>
      <BingoCardGenerationForm
        action={generateDomainCard}
        bingoGameId={bingoGameId}
        canGenerate={canBingoCardGenerate()}
      />
      <hr />
      <div className="flex flex-wrap gap-8">
        {bingoGame.bingoCards.map((bingoCard) => (
          <div key={bingoCard.id}>
            {bingoCard.name || '名無しのカード'}
            {bingoCard.squares.map((rows, ri) => (
              <div key={ri} className="flex">
                {rows.map((number, ci) => (
                  <div
                    key={`${ri}${ci}`}
                    className={`w-8 h-8 border rounded-sm ${
                      isCardBingo(bingoGame.lotteryNumbers, bingoCard.squares)
                        ? 'border-red-600'
                        : 'border-gray-500'
                    }`}
                  >
                    <div
                      className={`w-full h-full flex justify-center items-center ${
                        [...bingoGame.lotteryNumbers, FREE].includes(number)
                          ? 'bg-yellow-300 text-red-600'
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
        ))}
      </div>
    </div>
  );
}
