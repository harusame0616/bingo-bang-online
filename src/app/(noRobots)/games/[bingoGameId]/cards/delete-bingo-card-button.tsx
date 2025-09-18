"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useState, useTransition } from "react";

import { Button } from "@/components/Button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteBingoCardAction } from "./delete-bingo-card-action";

export function DeleteBingoCardButton({
	bingoCardId,
	bingoCardName,
}: {
	bingoCardId: string;
	bingoCardName: string;
}) {
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();

	const openDialog = () => {
		setOpen(true);
	};
	const closeDialog = () => {
		setOpen(false);
	};

	async function handleClick() {
		startTransition(async () => {
			await deleteBingoCardAction(bingoCardId);
		});
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger
				onClick={openDialog}
				aria-label="削除する"
				className="p-2"
			>
				<TrashIcon />
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
				<AlertDialogFooter>
					<Button variant="outline" type="button" onClick={closeDialog}>
						キャンセル
					</Button>
					<Button
						variant="destructive"
						type="submit"
						loading={pending}
						onClick={handleClick}
					>
						削除する
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
