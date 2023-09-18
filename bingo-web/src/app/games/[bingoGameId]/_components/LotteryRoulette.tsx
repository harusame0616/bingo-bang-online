'use client';

import { useSearchParams } from 'next/navigation';
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import React from 'react';

import { Button, ButtonProps } from '@/components/Button';

import { drawLotteryNumber } from './drawLotteryNumber';
import RouletteNumber from './RouletteNumber';

interface Props {
  bingoGameId: string;
  number?: number;
  finish: boolean;
}

export default function LotteryRoulette({
  bingoGameId,
  finish,
  number,
}: Props) {
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false);
  const searchParams = useSearchParams();
  const isSoundOff = searchParams.get('sound') !== 'off';

  useEffect(() => {
    if (!isRouletteSpinning) {
      return;
    }

    setIsRouletteSpinning(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number]);

  const startRoulette: MouseEventHandler<HTMLButtonElement> = async () => {
    setIsRouletteSpinning(true);
  };

  return (
    <div className="flex w-full flex-col">
      <label className="flex flex-col justify-center">
        <div className="text-center text-xs text-primary-darken">抽選結果</div>

        <RouletteNumber isSpinning={isRouletteSpinning} soundOff={!isSoundOff}>
          {number ?? '-'}
        </RouletteNumber>
      </label>

      <form action={drawLotteryNumber} className="flex justify-center">
        <input name="bingoGameId" hidden defaultValue={bingoGameId} />

        {isRouletteSpinning ? (
          <StopButton finish={finish} soundOff={!isSoundOff} />
        ) : (
          <StartButton onClick={startRoulette} finish={finish} />
        )}
      </form>
    </div>
  );
}

function StartButton({ finish, ...props }: { finish: boolean } & ButtonProps) {
  return (
    <Button type="button" {...props} disabled={finish}>
      {finish ? '抽選終了' : 'スタート'}
    </Button>
  );
}

function StopButton({
  finish,
  soundOff,
}: {
  finish: boolean;
  soundOff: boolean;
}) {
  const [stopAudio] = useState(soundOff ? null : new Audio('/se/stop.mp3'));

  const stopRoulette = useCallback(async () => {
    // useEffect で再生すると NotAllowedError が発生するためボタンクリック時に再生する
    await stopAudio?.play();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
