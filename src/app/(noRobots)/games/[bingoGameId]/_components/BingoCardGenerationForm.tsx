"use client";

import {
	type DetailedHTMLProps,
	type FormHTMLAttributes,
	useId,
	useState,
} from "react";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

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
	const [bingoCardName, setBingCardName] = useState("");
	const nameInputId = useId();

	const resetBingoCardName = () => {
		setBingCardName("");
	};

	const handleSubmit = (formData: FormData) => {
		if (typeof action === "function") {
			action?.(formData);
		}

		resetBingoCardName();
	};

	return (
		<form
			action={handleSubmit}
			{...formProps}
			className="flex w-full flex-col items-end gap-1 md:flex-row md:justify-center"
		>
			<input type="text" name="bingoGameId" hidden defaultValue={bingoGameId} />
			<label className="w-full max-w-md" htmlFor={nameInputId}>
				ビンゴカードの名前
			</label>
			<Input
				type="text"
				id={nameInputId}
				name="bingoCardName"
				maxLength={40}
				value={bingoCardName}
				onChange={(event) => setBingCardName(event.target.value)}
			/>
			<Button
				disabled={!canGenerate}
				disableInAction={true}
				disableInActionChildren="生成中です..."
				className="shrink-0"
			>
				生成する
			</Button>
		</form>
	);
}
