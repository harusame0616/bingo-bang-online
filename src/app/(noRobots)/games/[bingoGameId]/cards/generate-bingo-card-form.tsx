"use client";

import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { generateBingoCardAction } from "./generate-bingo-card-action";

type Props = { bingoGameId: string } | { bingoGameId?: string; disabled: true };

export function BingoCardGenerationForm(props: Props) {
	const bingoGameId = "bingoGameId" in props ? props.bingoGameId : undefined;
	const disabled = "disabled" in props ? props.disabled : false;
	const [cardName, setBingCardName] = useState("");
	const nameInputId = useId();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async () => {
		if (isPending || disabled || !bingoGameId) {
			return;
		}

		startTransition(async () => {
			await generateBingoCardAction({
				bingoGameId: bingoGameId,
				cardName,
			});

			setBingCardName("");
		});
	};

	return (
		<form action={handleSubmit}>
			<label className="w-full max-w-md" htmlFor={nameInputId}>
				ビンゴカードの名前
			</label>
			<div className="flex gap-1">
				<Input
					type="text"
					id={nameInputId}
					maxLength={40}
					value={cardName}
					onChange={(event) => setBingCardName(event.target.value)}
					disabled={disabled}
				/>
				<Button disabled={isPending || disabled} className="shrink-0">
					生成する
				</Button>
			</div>
		</form>
	);
}
