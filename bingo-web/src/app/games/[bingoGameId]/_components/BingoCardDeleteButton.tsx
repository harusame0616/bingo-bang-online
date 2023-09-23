'use client';

import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { deleteBingoCard } from '../_actions/deleteBingoCard';

export function BingoCardDeleteButton({
  bingoCardId,
  bingoCardName,
}: {
  bingoCardId: string;
  bingoCardName: string;
}) {
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger onClick={openDialog}>
        <Button
          variant="ghost"
          size="icon"
          className="border-destructive"
          aria-label="削除する"
        >
          <TrashIcon className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            「{bingoCardName}」のビンゴカードを削除しようとしています
          </AlertDialogTitle>
          <AlertDialogDescription>
            削除すると元に戻せません。ビンゴカードを削除してよろしいですか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          action={async (formData) => {
            await deleteBingoCard(formData);
            closeDialog();
          }}
        >
          <input hidden defaultValue={bingoCardId} name="bingoCardId" />
          <OperationButtons closeDialog={closeDialog} />
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function OperationButtons({ closeDialog }: { closeDialog: () => void }) {
  const { pending } = useFormStatus();

  return (
    <AlertDialogFooter>
      <AlertDialogCancel disabled={pending} onClick={closeDialog}>
        キャンセル
      </AlertDialogCancel>
      <Button variant="destructive" type="submit" disabled={pending}>
        {pending ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            削除中です...
          </>
        ) : (
          'もとに戻せないことを理解して削除する'
        )}
      </Button>
    </AlertDialogFooter>
  );
}
