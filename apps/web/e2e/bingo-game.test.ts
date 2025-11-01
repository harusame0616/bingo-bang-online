import { expect, type Page, test } from "@playwright/test";

const newGameTest = test.extend<{ page: Page }>({
	async page({ page }, use) {
		await page.goto("/");
		await page.getByRole("button", { name: "ビンゴゲームを開始する" }).click();
		await use(page);
	},
});

newGameTest("抽選した番号が履歴に記録される", async ({ page }) => {
	await test.step("初期状態を確認する", async () => {
		const lotteryNumberLocator = page.getByRole("status", {
			name: "抽選結果",
		});
		await expect(lotteryNumberLocator).toHaveText("-");
	});

	const drawnNumbers: string[] = [];

	await test.step("抽選（１回目）", async () => {
		await page.getByRole("button", { name: "スタート" }).click();
		await page.getByRole("button", { name: "ストップ" }).click();

		// 抽選処理完了を待つ
		await expect(page.getByRole("button", { name: "スタート" })).toBeVisible();
		// 抽選番号を記録
		const lotteryNumberLocator = page.getByRole("status", {
			name: "抽選結果",
		});

		const number = (await lotteryNumberLocator.textContent()) ?? "";
		drawnNumbers.push(number);
	});

	await test.step("抽選（２回目）", async () => {
		await page.getByRole("button", { name: "スタート" }).click();
		await page.getByRole("button", { name: "ストップ" }).click();

		// 抽選処理完了を待つ
		await expect(page.getByRole("button", { name: "スタート" })).toBeVisible();
		// 抽選番号を記録
		const lotteryNumberLocator = page.getByRole("status", {
			name: "抽選結果",
		});

		const number = (await lotteryNumberLocator.textContent()) ?? "";
		drawnNumbers.push(number);
	});

	await test.step("抽選（3回目）", async () => {
		await page.getByRole("button", { name: "スタート" }).click();
		await page.getByRole("button", { name: "ストップ" }).click();

		// 抽選処理完了を待つ
		await expect(page.getByRole("button", { name: "スタート" })).toBeVisible();
		// 抽選番号を記録
		const lotteryNumberLocator = page.getByRole("status", {
			name: "抽選結果",
		});
		const number = (await lotteryNumberLocator.textContent()) ?? "";
		drawnNumbers.push(number);
	});

	await test.step("抽選履歴に番号が古い順で記録されている", async () => {
		const historyRegion = page.getByRole("region", { name: "抽選履歴" });
		const historyItems = historyRegion.getByRole("listitem");

		// 履歴が3件表示されている
		await expect(historyItems).toHaveCount(3);

		// 履歴の順序を確認（古い順＝抽選した順番）
		await expect(historyItems.nth(0)).toHaveText(drawnNumbers[0]);
		await expect(historyItems.nth(1)).toHaveText(drawnNumbers[1]);
		await expect(historyItems.nth(2)).toHaveText(drawnNumbers[2]);
	});
});

test("75回抽選すると抽選終了になる", async ({ page }) => {
	await test.step("74回抽選済みのゲームにアクセスする", async () => {
		await page.goto("/games/12345678-1234-5678-1234-567812345678");
	});

	await test.step("抽選履歴が74個表示されている（永続化の確認）", async () => {
		const historyRegion = page.getByRole("region", { name: "抽選履歴" });
		await expect(historyRegion.getByRole("listitem")).toHaveCount(74);
	});

	await test.step("75回目の抽選を実行する", async () => {
		await page.getByRole("button", { name: "スタート" }).click();
		await page.getByRole("button", { name: "ストップ" }).click();

		// 抽選処理完了を待つ
		await expect(page.getByRole("button", { name: "抽選終了" })).toBeVisible();
	});

	await test.step("抽選履歴が75個になる", async () => {
		await expect(
			page.getByRole("region", { name: "抽選履歴" }).getByRole("listitem"),
		).toHaveCount(75);
	});

	await test.step("スタートボタンが「抽選終了」で非活性になる", async () => {
		await expect(page.getByRole("button", { name: "抽選終了" })).toBeDisabled();
	});
});

newGameTest("サウンド設定を切り替えられる", async ({ page }) => {
	let soundSwitch: ReturnType<typeof page.getByRole>;

	await test.step("サウンド設定がデフォルトでONになっている", async () => {
		soundSwitch = page.getByRole("switch", { name: "サウンド設定" });
		await expect(soundSwitch).toBeChecked();
	});

	await test.step("スイッチをOFFに切り替える", async () => {
		await soundSwitch.click();
		await expect(soundSwitch).not.toBeChecked();
	});

	await test.step("スイッチをONに切り替える", async () => {
		await soundSwitch.click();
		await expect(soundSwitch).toBeChecked();
	});

	// TODO: 音声が実際に鳴っているかの確認
	// - サウンドON時：ルーレット中に音声が鳴る
	// - サウンドOFF時：ルーレット中に音声が鳴らない
});
