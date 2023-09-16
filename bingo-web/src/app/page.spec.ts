import { expect, test } from '@playwright/test';

test.describe('トップページ', () => {
  const path = '/';

  test('ビンゴゲームを開始できる', async ({ page }) => {
    await page.goto(path);

    await page
      .getByRole('button', { name: '新しくビンゴゲームを開始する' })
      .click();
    await expect(page).toHaveURL(/.*\/games\/.+$/);
  });
});
