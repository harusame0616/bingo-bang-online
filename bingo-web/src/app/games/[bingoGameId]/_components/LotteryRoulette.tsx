'use client';

import { Pacifico } from '@next/font/google';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';

import { drawLotteryNumber } from './drawLotteryNumber';

interface Props {
  bingoGameId: string;
  number?: number;
  finish?: boolean;
}

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });

export default function LotteryRoulette({
  bingoGameId,
  finish,
  number,
}: Props) {
  const [lotteryNumber, setLotteryNumber] = useState(1);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [isRouletteStart, setIsRouletteStart] = useState(false);
  const [spiningAudio] = useState(new Audio('/se/spinning.mp3'));
  const [stopAudio] = useState(new Audio('/se/stop.mp3'));

  useEffect(() => {
    spiningAudio.loop = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isRouletteStart) {
      return;
    }

    setIsRouletteStart(false);
    clearInterval(timer);

    spiningAudio.pause();
    stopAudio.play();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const startRoulette = async () => {
    await spiningAudio.play();
    setIsRouletteStart(true);

    const newTimer = window.setInterval(() => {
      setLotteryNumber(generateLotteryNumber());
    }, 100);

    setTimer(newTimer);
  };

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor="lottery-result"
        className="text-center text-xs text-primary-lighter"
      >
        抽選結果
      </label>
      <output
        id="lottery-result"
        className={`-mt-16 text-center text-[14rem] ${
          isRouletteStart ? 'text-primary-lighten' : 'text-primary-darken'
        } ${numberFont.className}`}
        data-testid="last_lottery_number"
      >
        {isRouletteStart ? lotteryNumber : number ?? '-'}
      </output>

      <form action={drawLotteryNumber}>
        <input
          type="text"
          name="bingoGameId"
          hidden
          defaultValue={bingoGameId}
        />

        <div className=" flex justify-center">
          {isRouletteStart ? (
            <Button
              disableInAction={true}
              disableInActionChildren="抽選中..."
              disabled={finish}
            >
              ストップ
            </Button>
          ) : (
            <Button type="button" onClick={startRoulette} disabled={finish}>
              {finish ? '抽選終了' : 'スタート'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function generateLotteryNumber() {
  return Math.floor(Math.random() * LOTTERY_NUMBER_MAX) + 1;
}
