'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useRef } from 'react';

type Props = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & { bingoGameId: string; canGenerate: boolean };

export default function BingoCardGenerationForm({
  bingoGameId,
  canGenerate,
  action,
  ...formProps
}: Props) {
  const bingoCardNameInput = useRef<HTMLInputElement>(null);

  const resetBingoCardName = () => {
    if (bingoCardNameInput.current) {
      bingoCardNameInput.current.value = '';
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (typeof action === 'function') {
      action?.(formData);
    }

    resetBingoCardName();
  };

  return (
    <form action={handleSubmit} {...formProps}>
      <input type="text" name="bingoGameId" hidden defaultValue={bingoGameId} />
      ビンゴカードの名前：
      <input
        type="text"
        name="bingoCardName"
        className="bg-black"
        ref={bingoCardNameInput}
      />
      <button disabled={canGenerate}>BingoCard 生成</button>
    </form>
  );
}
