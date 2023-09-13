'use client';

import { Pacifico } from '@next/font/google';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';

type Props = {
  number?: number;
};

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });

export default function LotteryRoulette({ number = 0 }: Props) {
  const [lotteryNumber, setLotteryNumber] = useState(1);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [isRouletteStart, setIsRouletteStart] = useState(false);
  const [spiningAudio] = useState(new Audio('/se/spinning.mp3'));
  const [stopAudio] = useState(new Audio('/se/stop.mp3'));

  useEffect(() => {
    spiningAudio.loop = true;
  }, []);

  useEffect(() => {
    if (!isRouletteStart) {
      clearInterval(timer);
      return;
    }

    const newTimer = window.setInterval(() => {
      setLotteryNumber(generateLotteryNumber());
    }, 100);

    setTimer(newTimer);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRouletteStart]);

  useEffect(() => {
    setIsRouletteStart(false);
  }, [number]);

  const startRoulette = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    spiningAudio.play();
    setIsRouletteStart(true);
  };

  const stopRoulette = () => {
    spiningAudio.pause();
    stopAudio.play();
    setIsRouletteStart(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex justify-center text-[14rem] ${
          isRouletteStart ? 'text-primary-lighten' : 'text-primary-darken'
        } ${numberFont.className}`}
      >
        {isRouletteStart ? lotteryNumber : number}
      </div>

      <div className="flex justify-center mt-10">
        {isRouletteStart ? (
          <Button onClick={stopRoulette} disableInAction={true}>
            ストップ
          </Button>
        ) : (
          <Button onClick={startRoulette}>スタート</Button>
        )}
      </div>
    </div>
  );
}

function generateLotteryNumber() {
  return Math.floor(Math.random() * LOTTERY_NUMBER_MAX) + 1;
}
