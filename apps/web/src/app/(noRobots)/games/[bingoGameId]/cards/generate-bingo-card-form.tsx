"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { generateBingoCardAction } from "./generate-bingo-card-action";

const formSchema = v.object({
	cardName: v.pipe(
		v.string("ビンゴカードの名前を入力してください"),
		v.maxLength(20, "ビンゴカードの名前は40文字以内で入力してください"),
	),
});

type FormSchema = v.InferOutput<typeof formSchema>;

type Props = { bingoGameId: string } | { bingoGameId?: string; disabled: true };

export function BingoCardGenerationForm(props: Props) {
	const bingoGameId = props.bingoGameId;
	const disabled = "disabled" in props ? props.disabled : false;
	const [isPending, startTransition] = useTransition();

	const form = useForm<FormSchema>({
		resolver: valibotResolver(formSchema),
		defaultValues: {
			cardName: "",
		},
	});

	const handleSubmit = (values: FormSchema): void => {
		if (disabled || !bingoGameId) {
			return;
		}

		startTransition(async () => {
			await generateBingoCardAction({
				bingoGameId: bingoGameId,
				cardName: values.cardName,
			});

			form.reset();
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="cardName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ビンゴカードの名前</FormLabel>
							<div className="flex gap-1">
								<FormControl>
									<Input {...field} type="text" disabled={disabled} />
								</FormControl>
								<Button
									type="submit"
									disabled={isPending || disabled}
									className="shrink-0"
								>
									生成する
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
