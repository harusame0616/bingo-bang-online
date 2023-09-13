'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useRef } from 'react';

import { ButtonOutline } from '@/components/Button';

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
    <form
      action={handleSubmit}
      {...formProps}
      className="flex flex-col items-center w-full"
    >
      <label className="max-w-md w-full">
        <input
          type="text"
          name="bingoGameId"
          hidden
          defaultValue={bingoGameId}
        />
        ビンゴカードの名前
      </label>
      <input
        type="text"
        name="bingoCardName"
        className="  border border-slate-800 p-2 rounded-md mb-1 max-w-lg w-full"
        ref={bingoCardNameInput}
      />
      <div>
        <ButtonOutline disabled={canGenerate} disableInAction={true}>
          ビンゴカードを生成する
        </ButtonOutline>
      </div>
    </form>
  );
}
