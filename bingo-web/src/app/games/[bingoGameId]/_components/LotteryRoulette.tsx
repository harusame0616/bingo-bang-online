'use client';

import { Pacifico } from '@next/font/google';
import { useSearchParams } from 'next/navigation';
import { MouseEventHandler, useEffect, useState } from 'react';

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
  const searchParams = useSearchParams();
  const needsPlaySound = searchParams.get('sound') !== 'off';
  const [spiningAudio] = useState(
    needsPlaySound ? new Audio('/se/spinning.mp3') : null,
  );
  const [stopAudio] = useState(
    needsPlaySound ? new Audio('/se/stop.mp3') : null,
  );
  useEffect(() => {
    if (spiningAudio) {
      spiningAudio.loop = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isRouletteStart) {
      return;
    }

    setIsRouletteStart(false);
    clearInterval(timer);

    spiningAudio?.pause();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const startRoulette: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await spiningAudio?.play();
    setIsRouletteStart(true);

    const newTimer = window.setInterval(() => {
      setLotteryNumber(generateLotteryNumber());
    }, 150);

    setTimer(newTimer);
  };

  const stopRoulette = async () => {
    // useEffect で再生すると NotAllowedError が発生するため stopAudio はボタンクリック時に再生する
    await stopAudio?.play();
  };

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor="lottery-result"
        className="text-center text-xs text-primary-darken"
      >
        抽選結果
      </label>
      <output
        id="lottery-result"
        className={`-mt-24 text-center text-[14rem] ${
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
              onClick={stopRoulette}
            >
              ストップ
            </Button>
          ) : (
            <Button onClick={startRoulette} disabled={finish}>
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
