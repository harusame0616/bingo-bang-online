"use client";

import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	useEffect,
	useId,
	useOptimistic,
	useState,
	useTransition,
} from "react";

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
	const [isFinishIconVisible, setIsFinishIconVisible] = useState(false);
	const { toast } = useToast();
	const settingId = useId();

	// 完了アイコンが表示されたら2秒後に非表示にする
	useEffect(() => {
		if (isFinishIconVisible) {
			const timer = setTimeout(() => {
				setIsFinishIconVisible(false);
			}, 2000);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [isFinishIconVisible]);

	function handleSoundChange(checked: boolean): void {
		setIsFinishIconVisible(false);
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
			} else {
				setIsFinishIconVisible(true);
			}
		});
	}

	return (
		<div className="flex items-center justify-center gap-4 py-4">
			<Label htmlFor={settingId} className="text-base font-medium">
				サウンド設定
			</Label>
			<div className="flex items-center gap-2">
				<Switch
					id={settingId}
					checked={optimisticSound}
					onCheckedChange={handleSoundChange}
					disabled={disabled || isPending}
					aria-busy={isPending}
				/>
				<div className="w-5 h-5" aria-hidden="true">
					{isPending && (
						<div className="animate-in fade-in zoom-in duration-300">
							<ReloadIcon className="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					)}
					{isFinishIconVisible && (
						<div className="animate-in fade-in zoom-in duration-200">
							<CheckIcon className="h-5 w-5 text-green-600" />
						</div>
					)}
				</div>
			</div>
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{isPending && "サウンド設定を更新中"}
				{isFinishIconVisible && "サウンド設定を更新しました"}
			</div>
		</div>
	);
}
