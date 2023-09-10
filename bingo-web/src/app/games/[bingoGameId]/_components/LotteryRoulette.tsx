'use client';

import { MouseEventHandler, useEffect, useState } from 'react';

import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';

type Props = {
  number?: number;
};

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
      <div className="flex justify-center text-9xl text-red-600">
        {isRouletteStart ? lotteryNumber : number}
      </div>

      <div className="flex justify-center">
        {isRouletteStart ? (
          <button onClick={stopRoulette}>ストップ</button>
        ) : (
          <button onClick={startRoulette}>スタート</button>
        )}
      </div>
    </div>
  );
}

function generateLotteryNumber() {
  return Math.floor(Math.random() * LOTTERY_NUMBER_MAX) + 1;
}
