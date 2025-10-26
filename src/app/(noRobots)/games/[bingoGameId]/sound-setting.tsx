"use client";

import { useId, useOptimistic, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

	function handleSoundChange(checked: boolean): void {
		startTransition(async () => {
			setOptimisticSound(checked);

			const result = await updateSoundSettingAction({
				bingoGameId,
				sound: checked,
			});

			if (!result.success) {
				toast({
					variant: "destructive",
					title: "エラー",
					description: result.error || "サウンド設定の更新に失敗しました",
				});
			}
		});
	}

	return (
		<div className="flex items-center justify-center gap-4 py-4">
			<Label htmlFor={settingId} className="text-base font-medium">
				サウンド設定
			</Label>
			<Switch
				id={settingId}
				checked={optimisticSound}
				onCheckedChange={handleSoundChange}
				disabled={disabled || isPending}
			/>
		</div>
	);
}
