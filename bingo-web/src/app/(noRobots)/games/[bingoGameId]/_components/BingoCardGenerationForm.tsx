'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useState } from 'react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

type Props = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & { bingoGameId: string; canGenerate: boolean };

export default function BingoCardGenerationForm({
  action,
  bingoGameId,
  canGenerate,
  ...formProps
}: Props) {
  const [bingoCardName, setBingCardName] = useState('');

  const resetBingoCardName = () => {
    setBingCardName('');
  };

  const handleSubmit = (formData: FormData) => {
    if (typeof action === 'function') {
      action?.(formData);
    }

    resetBingoCardName();
  };

  return (
    <form
      action={handleSubmit}
      {...formProps}
      className="flex w-full flex-col items-end gap-1 md:flex-row md:justify-center"
    >
      <input type="text" name="bingoGameId" hidden defaultValue={bingoGameId} />
      <label className="w-full max-w-md">
        ビンゴカードの名前
        <Input
          type="text"
          name="bingoCardName"
          maxLength={40}
          value={bingoCardName}
          onChange={(event) => setBingCardName(event.target.value)}
        />
      </label>
      <Button
        disabled={!canGenerate}
        disableInAction={true}
        disableInActionChildren="生成中です..."
        className="shrink-0"
      >
        生成する
      </Button>
    </form>
  );
}
