"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startBingoGame } from "./start-bingo-game";
import { Button } from "@/components/ui/button";

export function BingoStartButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");

	function handleClick() {
		startTransition(async () => {
			try {
				const result = await startBingoGame();

				if (result?.success) {
					router.push(`/games/${result.data.bingoGameId}`);
					return;
				}
				setErrorMessage(
					result?.message ||
						"何らかのエラーが発生しました。時間をおいて画面を再読み込みし、最初からやり直してください",
				);
			} catch (error: unknown) {
				console.error("catch", error, (error as Error).message);
				setErrorMessage('エラーが発生しました。時間をおいてお試しください')

			}
		});
	}

	return (
		<div>
			<div className="flex flex-col items-center">
				<Button
					type="button"
					className="max-w-[220px]"
					onClick={handleClick}
					disabled={isPending}
				>
					ビンゴゲームを開始する
				</Button>
			</div>
			{errorMessage && (
				<div className="mt-4 text-destructive border border-destructive rounded-lg p-2">
					{errorMessage}
				</div>
			)}
		</div>
	);
}
