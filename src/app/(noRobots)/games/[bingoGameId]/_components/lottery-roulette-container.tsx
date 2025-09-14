import { notFound } from 'next/navigation';

import prisma from '@/lib/prisma';

import LotteryRoulettePresenter from './LotteryRoulette';

interface Props {
  bingoGameId: string;
  sound: boolean;
}
export async function LotteryRouletteContainer({ bingoGameId, sound }: Props) {
  async function getIsGameFinished() {
    const bingoGame = await prisma.bingoGameEntity.findUnique({
      where: {
        id: bingoGameId,
      },
    });
    if (!bingoGame) {
      notFound();
    }

    return bingoGame.lotteryNumbers.length === 75;
  }

  return (
    <LotteryRoulettePresenter
      bingoGameId={bingoGameId}
      finish={await getIsGameFinished()}
      sound={sound}
    />
  );
}
