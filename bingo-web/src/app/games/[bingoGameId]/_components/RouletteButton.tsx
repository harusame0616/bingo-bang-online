'use client';

const RouletteButtonTypeEnum = {
  START: 'start',
  STOP: 'stop',
};

type RouletteButtonType =
  (typeof RouletteButtonTypeEnum)[keyof typeof RouletteButtonTypeEnum];

type Props = { buttonType: RouletteButtonType };
