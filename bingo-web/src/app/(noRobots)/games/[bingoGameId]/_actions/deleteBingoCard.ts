'use server';

import { revalidatePath } from 'next/cache';

import { BingoCardDeleteUsecase } from '@/domains/BingoCard/usecases/BingoCardDelete.usecase';
import { getRepository } from '@/lib/infra/getRepository';

export async function deleteBingoCard(formData: FormData) {
  const bingoCardId = formData.get('bingoCardId');

  if (typeof bingoCardId !== 'string') {
    throw new Error('bingoGameId is invalid type');
  }

  const bingoCardDeleteUsecase = new BingoCardDeleteUsecase({
    bingoCardRepository: getRepository('bingoCard'),
  });

  await bingoCardDeleteUsecase.execute(bingoCardId);

  revalidatePath('/game/[bingoGameId]');
}
