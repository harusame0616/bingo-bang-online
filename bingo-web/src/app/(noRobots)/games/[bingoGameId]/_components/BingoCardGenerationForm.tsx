'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
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
      <input type="text" name="bingoGameId" hidden defaultValue={bingoGameId} />
      <label className="w-full max-w-md">
        ビンゴカードの名前
        <input
          type="text"
          name="bingoCardName"
          className="  mb-1 w-full max-w-lg rounded-md border border-slate-800 p-2"
          ref={bingoCardNameInput}
        />
      </label>
      <ButtonOutline
        disabled={!canGenerate}
        disableInAction={true}
        disableInActionChildren={
          <div className="flex items-center">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ビンゴカードを生成中です
          </div>
        }
      >
        ビンゴカードを生成する
      </ButtonOutline>
    </form>
  );
}
