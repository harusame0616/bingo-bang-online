'use client';

import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/Button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        <Button variant="ghost" size="icon" aria-label="削除する">
          <TrashIcon />
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
          <AlertDialogFooter>
            <Button variant="outline" type="button" onClick={closeDialog}>
              キャンセル
            </Button>
            <Button
              variant="destructive"
              type="submit"
              disableInAction
              disableInActionChildren="削除中です"
            >
              もとに戻せないことを理解して削除する
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
