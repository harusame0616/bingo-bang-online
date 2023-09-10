"use client";

import { LOTTERY_NUMBER_MAX } from "@/domains/BingoCard/models/BingoCard";
import { useEffect, useState } from "react";

type Props = {
  number?: number;
  children: React.ReactNode;
};

export default function LotteryRoulette({ number = 0, children }: Props) {
  const [lotteryNumber, setLotteryNumber] = useState(1);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [isRouletteStart, setIsRouletteStart] = useState(false);

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

  const startRoulette = () => {
    setIsRouletteStart(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center text-9xl text-red-600">
        {isRouletteStart ? lotteryNumber : number}
      </div>

      <div className="flex justify-center">
        {isRouletteStart ? (
          children
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
