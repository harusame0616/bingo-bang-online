import { redirect } from 'next/navigation';

import { BingoGameCreateUsecase } from '@/domains/BingoGame/usecases/BingoGameCreate.usecase';
import { getRepository } from '@/lib/getRepository';

import BingoGameStartButton from './_components/BingoGameStartButton';

async function startBingoGame() {
  'use server';
  const createUsecase = new BingoGameCreateUsecase(getRepository('bingoGame'));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}`);
}

export default function Home() {
  return (
    <main className="w-full h-full flex justify-center">
      <form action={startBingoGame}>
        <BingoGameStartButton />
      </form>
    </main>
  );
}
