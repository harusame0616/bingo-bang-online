import { expect, test } from '@playwright/test';

test.describe('ビンゴゲーム管理ページ', () => {
  const path = '/';

  test('ビンゴカードの作成、削除ができる', async ({ page }) => {
    // ビンゴゲームを開始する
    await page.goto(path);

    // ビンゴゲームを開始する
    await page
      .getByRole('button', { name: '新しくビンゴゲームを開始する' })
      .click();

    // ビンゴカードの名前をつけて作成する
    await page.getByLabel('ビンゴカードの名前').click();
    await page.keyboard.type('bingonta');
    await page.getByRole('button', { name: 'ビンゴカードを生成する' }).click();

    // ビンゴカードの名前の入力欄が空になる
    await expect(page.getByLabel('ビンゴカードの名前')).toBeEmpty();
    // 名前の付いたビンゴカードが作成される
    await expect(page.getByRole('figure', { name: 'bingonta' })).toBeVisible();

    // ビンゴカードの名前をつけずに作成する
    await page.getByLabel('ビンゴカードの名前').click();
    await page.getByRole('button', { name: 'ビンゴカードを生成する' }).click();

    // 名前のついていないビンゴカードが作成される
    await expect(
      page.getByRole('figure', { name: '名無しのカード' }),
    ).toBeVisible();

    // ビンゴカードを削除する
    await page.getByRole('button', { name: '削除' }).first().click();
    await expect(page.getByRole('figure', { name: 'bingonta' })).toBeHidden();
  });

  test('番号の抽選', async ({ page }) => {
    test.slow();
    // ビンゴゲームを開始する
    await page.goto(path);

    // ビンゴゲームを開始する
    await page
      .getByRole('button', { name: '新しくビンゴゲームを開始する' })
      .click();

    // 抽選結果の初期値が表示されている
    const lotteryNumberLocator = page.getByLabel('抽選結果');
    await expect(lotteryNumberLocator).toHaveText('-');

    // 番号を抽選する
    await page.getByRole('button', { name: 'スタート' }).click();
    await page.getByRole('button', { name: 'ストップ' }).click();

    // スタートボタンが有効化され抽選結果が表示される
    await expect(page.getByRole('button', { name: 'スタート' })).toBeEnabled();
    await expect(lotteryNumberLocator).toHaveText(/^[0-9]{1,2}$/);

    // 抽選履歴が表示されて、抽選結果と一致する
    await expect(page.getByTestId('lottery_number_history_1')).toHaveText(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (await lotteryNumberLocator.textContent())!,
    );

    for (const _ in [...new Array(74)]) {
      await expect(
        page.getByRole('button', { name: 'スタート' }),
      ).toBeEnabled();
      await page.getByRole('button', { name: 'スタート' }).click();
      await page.getByRole('button', { name: 'ストップ' }).click();
      await page.waitForTimeout(100);
    }

    // 全部の数字を抽選したら、スタートボタンが「抽選終了」になり無効になる
    await expect(page.getByRole('button', { name: '抽選終了' })).toBeDisabled();
  });
});
