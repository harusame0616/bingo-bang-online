'use client';

import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/Button';

import { drawLotteryNumber } from '../_actions/drawLotteryNumber';
import { NumberSpinner } from './number-spinner';

interface Props {
  bingoGameId: string;
  finish: boolean;
  loading?: boolean;
  sound?: boolean;
}

export default function LotteryRoulettePresenter({
  bingoGameId,
  finish,
  loading,
  sound = false,
}: Props) {
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false);
  const [lotteryNumber, setLotteryNumber] = useState<number>();

  function startRoulette() {
    setIsRouletteSpinning(true);
  }

  function handleStop(lotteryNumber: number) {
    setLotteryNumber(lotteryNumber);
    setIsRouletteSpinning(false);
  }

  return (
    <div className="flex w-full flex-col">
      <NumberSpinner isSpinning={isRouletteSpinning} sound={sound}>
        {lotteryNumber ?? '-'}
      </NumberSpinner>
      <div className="mx-auto">
        {loading ? (
          <Button disabled>読込中</Button>
        ) : isRouletteSpinning ? (
          <StopButton
            finish={finish}
            sound={sound}
            onStop={handleStop}
            bingoGameId={bingoGameId}
          />
        ) : (
          <StartButton onClick={startRoulette} finish={finish} />
        )}
      </div>
    </div>
  );
}

function StartButton({
  finish,
  onClick,
}: {
  finish: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" disabled={finish} onClick={onClick}>
      {finish ? '抽選終了' : 'スタート'}
    </Button>
  );
}

function StopButton({
  bingoGameId,
  finish,
  onStop,
  sound,
}: {
  finish: boolean;
  sound: boolean;
  bingoGameId: string;
  onStop: (lotteryNumber: number) => void;
}) {
  const stopAudio = useRef(sound ? new Audio('/se/stop.mp3') : null);

  const stopRoulette = useCallback(async () => {
    const number = await drawLotteryNumber(bingoGameId);
    onStop(number);

    await stopAudio.current?.play();
  }, [onStop, bingoGameId]);

  return (
    <Button
      disableInAction={true}
      disableInActionChildren="抽選中..."
      disabled={finish}
      onClick={stopRoulette}
    >
      ストップ
    </Button>
  );
}
