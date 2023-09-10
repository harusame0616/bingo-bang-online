import { redirect } from 'next/navigation';

import { BingoGameCreateUsecase } from '@/domains/BingoGame/usecases/BingoGameCreate.usecase';
import { getRepository } from '@/lib/getRepository';

async function startBingoGame() {
  'use server';
  const createUsecase = new BingoGameCreateUsecase(getRepository('bingoGame'));

  const bingoGame = await createUsecase.execute();
  redirect(`/games/${bingoGame.id}`);
}

export default function Home() {
  return (
    <main>
      <form action={startBingoGame}>
        <button type="submit">ビンゴゲームを開始する</button>
      </form>
    </main>
  );
}
