'use client';

import { Pacifico } from '@next/font/google';
import { PropsWithChildren, useEffect, useState } from 'react';
import React from 'react';

import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';

interface Props {
  soundOff?: boolean;
  isSpinning: boolean;
}

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });

export default function LotteryRoulette({
  children,
  isSpinning,
  soundOff = false,
}: PropsWithChildren<Props>) {
  const [lotteryNumber, setLotteryNumber] = useState(1);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const needsPlaySound = soundOff !== true;
  const [audioContext] = useState(needsPlaySound ? new AudioContext() : null);
  const [spinAudioSource] = useState(audioContext?.createBufferSource());

  useEffect(() => {
    const audioSetting = async () => {
      if (!audioContext || !spinAudioSource) {
        return;
      }
      const response = await fetch('/se/spin.mp3');
      const audioData = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(audioData);
      spinAudioSource.buffer = buffer;
      spinAudioSource.loop = true;
      spinAudioSource.connect(audioContext.destination);
      audioContext.suspend();
      spinAudioSource.start();
    };

    audioSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isSpinning) {
      audioContext?.suspend();
      clearInterval(timer);

      return;
    }

    audioContext?.resume();
    const newTimer = window.setInterval(() => {
      setLotteryNumber(generateLotteryNumber());
    }, 150);

    setTimer(newTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  return (
    <output
      className={`-mt-24 text-center text-[14rem] ${
        isSpinning ? 'text-primary-lighten' : 'text-primary-darken'
      } ${numberFont.className}`}
    >
      {isSpinning ? lotteryNumber : children}
    </output>
  );
}

function generateLotteryNumber() {
  return Math.floor(Math.random() * LOTTERY_NUMBER_MAX) + 1;
}
