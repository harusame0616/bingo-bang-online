'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

import { Button } from '@/components/Button';

export default function BingoGameStartForm() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending ? 'ビンゴゲームを準備中です' : '新しいビンゴゲームを開始する'}
    </Button>
  );
}
