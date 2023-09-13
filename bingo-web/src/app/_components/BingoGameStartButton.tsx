'use client';

import { Button } from '@/components/Button';

export default function BingoGameStartForm() {
  return (
    <Button
      disableInAction={true}
      disableInActionChildren="ビンゴゲームを準備中です"
    >
      新しいビンゴゲームを開始する
    </Button>
  );
}
