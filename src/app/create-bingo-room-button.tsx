"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createBingoRoomAction } from "./create-bingo-room-action";

export function CreateBingoRoomButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	function handleClick() {
		startTransition(async () => {
			try {
				const result = await createBingoRoomAction();

				if (result?.success) {
					router.push(`/games/${result.data.bingoGameId}`);
					return;
				}

				if (result?.message) {
					throw new Error(result.message);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage(
						"不明なエラーが発生しました。時間をおいて再読込し、最初からお試しください",
					);
				}
			}
		});
	}

	return (
		<div className="flex flex-col items-center">
			<Button
				type="button"
				className="w-[220px]"
				onClick={handleClick}
				disabled={isPending}
			>
				{isPending ? (
					<ReloadIcon className="animate-spin" />
				) : (
					"ビンゴルームを作成する"
				)}
			</Button>
			{errorMessage && (
				<div className="mt-4 text-destructive border border-destructive rounded-lg p-2">
					{errorMessage}
				</div>
			)}
		</div>
	);
}
