'use server';

import { revalidatePath } from 'next/cache';

import { BingoGameDrawLotteryNumberUsecase } from '@/domains/BingoGame/usecases/BingoGameDrawLotteryNumber.usecase';
import { getRepository } from '@/lib/infra/getRepository';

export async function drawLotteryNumber(formData: FormData) {
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
