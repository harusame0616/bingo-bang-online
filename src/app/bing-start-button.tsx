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
			const result = await startBingoGame();

			if (result?.success) {
				router.push(`/games/${result.data.bingoGameId}`);
				return;
			}

			setErrorMessage(
				result?.message ||
					"何らかのエラーが発生しました。時間をおいて画面を再読み込みし、最初からやり直してください",
			);
		});
	}

	return (
		<div>
			<Button type="button" onClick={handleClick} className="mx-auto" disabled={isPending}>
				新しくビンゴゲームを開始する
			</Button>
			{errorMessage && (
				<div className="mt-4 text-destructive border border-destructive rounded-lg p-2">
					{errorMessage}
				</div>
			)}
		</div>
	);
}
