"use client";

import { useId, useOptimistic, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { updateSoundSettingAction } from "./update-sound-setting-action";

interface Props {
	bingoGameId: string;
	sound: boolean;
	disabled?: boolean;
}

export function SoundSetting({ bingoGameId, sound, disabled = false }: Props) {
	const [isPending, startTransition] = useTransition();
	const [optimisticSound, setOptimisticSound] = useOptimistic(
		sound,
		(_state, newSound: boolean) => newSound,
	);
	const { toast } = useToast();
	const settingId = useId();
	const onId = useId();
	const offId = useId();

	function handleSoundChange(value: string) {
		const newSound = value === "on";

		startTransition(async () => {
			setOptimisticSound(newSound);

			const result = await updateSoundSettingAction({
				bingoGameId,
				sound: newSound,
			});

			if (!result.success) {
				toast({
					variant: "destructive",
					title: "エラー",
					description: result.message || "サウンド設定の更新に失敗しました",
				});
			}
		});
	}

	return (
		<div className="flex items-center justify-center gap-4 py-4">
			<Label htmlFor={settingId} className="text-base font-medium">
				サウンド設定
			</Label>
			<RadioGroup
				id={settingId}
				value={optimisticSound ? "on" : "off"}
				onValueChange={handleSoundChange}
				disabled={disabled || isPending}
				className="flex gap-4"
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="on" id={onId} />
					<Label htmlFor={onId} className="cursor-pointer">
						On
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="off" id={offId} />
					<Label htmlFor={offId} className="cursor-pointer">
						Off
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
