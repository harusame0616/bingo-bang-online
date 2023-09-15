'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useRef } from 'react';

import { ButtonOutline } from '@/components/Button';

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
      className="flex w-full flex-col items-center"
    >
      <label className="w-full max-w-md">
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
        className="  mb-1 w-full max-w-lg rounded-md border border-slate-800 p-2"
        ref={bingoCardNameInput}
      />
      <div>
        <ButtonOutline disabled={!canGenerate} disableInAction={true}>
          ビンゴカードを生成する
        </ButtonOutline>
      </div>
    </form>
  );
}
