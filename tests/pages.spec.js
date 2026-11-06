import { test, expect } from '@playwright/test';

test('composes the Pages artifact under the repository path', async ({
  page,
  context,
  request,
}, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('./');
  expect(response.status()).toBe(200);
  await expect(page.locator('[data-microfrontend]')).toHaveCount(4);
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Habit Tracker' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Education' }).click();
  await expect(page).toHaveURL(/\/Portfolio\/#education$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://beltbunny05.github.io/Portfolio/',
  );

  const manifestResponse = await request.get('microfrontends.json');
  const manifest = await manifestResponse.json();
  for (const entry of Object.values(manifest)) {
    expect(entry).toMatch(/^\.\/remotes\//);
    expect((await request.get(entry)).status()).toBe(200);
  }
  const [resume] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'View résumé' }).click(),
  ]);
  await expect(resume).toHaveURL('http://127.0.0.1:6200/Portfolio/resume.html');
  await expect(
    resume.getByRole('heading', { name: 'Software Engineer', exact: true }),
  ).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://beltbunny05.github.io/Portfolio/social-card.png',
  );
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#projects');
  await expect(page.locator('[data-microfrontend]')).toHaveCount(4);
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('pages-mobile.png'), fullPage: true });
});
