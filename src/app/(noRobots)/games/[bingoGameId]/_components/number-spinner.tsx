'use client';

import { Pacifico } from 'next/font/google';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import React from 'react';

import { LOTTERY_NUMBER_MAX } from '@/domains/BingoCard/models/BingoCard';
import { cn } from '@/lib/utils';

interface Props {
  sound?: boolean;
  isSpinning: boolean;
}

const numberFont = Pacifico({ subsets: ['latin'], weight: '400' });

export function NumberSpinner({
  children,
  isSpinning,
  sound = false,
}: PropsWithChildren<Props>) {
  const [lotteryNumber, setLotteryNumber] = useState(1);
  const timer = useRef<number>(null);
  const audioContext = useRef<AudioContext>(null);
  const spinAudioSource = useRef<AudioBufferSourceNode>(null);
  const audioBuffer = useRef<AudioBuffer>(null);

  useEffect(() => {
    if (!sound) {
      return;
    }

    const audioSetting = async () => {
      audioContext.current = new AudioContext();

      const response = await fetch('/se/spin.mp3');
      const audioData = await response.arrayBuffer();
      audioBuffer.current =
        await audioContext.current.decodeAudioData(audioData);
    };

    audioSetting();
    return () => {
      if (spinAudioSource.current) {
        try {
          spinAudioSource.current.stop();
          spinAudioSource.current.disconnect();
          spinAudioSource.current = null;
        } catch {}
      }
      audioContext.current?.close();
    };
  }, [sound]);

  const playSound = useCallback(() => {
    if (!audioContext.current || !audioBuffer.current || !sound) {
      return;
    }

    // 既存のソースがあれば停止
    if (spinAudioSource.current) {
      try {
        spinAudioSource.current.stop();
        spinAudioSource.current.disconnect();
      } catch {}
    }

    // 新しいソースを作成
    spinAudioSource.current = audioContext.current.createBufferSource();
    spinAudioSource.current.buffer = audioBuffer.current;
    spinAudioSource.current.loop = true;
    spinAudioSource.current.connect(audioContext.current.destination);
    spinAudioSource.current.start();
  }, [sound]);

  const stopSound = useCallback(() => {
    if (!sound) {
      return;
    }

    if (spinAudioSource.current) {
      try {
        spinAudioSource.current.stop();
        spinAudioSource.current.disconnect();
        spinAudioSource.current = null;
      } catch {}
    }
  }, [sound]);

  useEffect(() => {
    if (!isSpinning && timer.current) {
      stopSound();
      clearInterval(timer.current);
      return;
    }

    playSound();
    timer.current = window.setInterval(() => {
      setLotteryNumber(generateLotteryNumber());
    }, 150);
    return () => {
      stopSound();
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [isSpinning, sound, playSound, stopSound]);

  return (
    <output
      className={cn(
        '-mt-24 text-center text-[14rem]',
        isSpinning ? 'text-primary-lighten' : 'text-primary-darken',
        numberFont.className,
      )}
      aria-label="抽選結果"
      aria-live={isSpinning ? 'off' : 'polite'}
    >
      {isSpinning ? lotteryNumber : children}
    </output>
  );
}

function generateLotteryNumber() {
  return Math.floor(Math.random() * LOTTERY_NUMBER_MAX) + 1;
}
