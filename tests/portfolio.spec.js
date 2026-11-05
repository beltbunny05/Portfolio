import { test, expect } from '@playwright/test';
test('composes independently served remotes and navigates across boundaries', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Solid architecture');
  await expect(page.getByRole('heading', { name: 'Habit Tracker' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MBA, Software Engineering' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Education' }).click();
  await expect(page).toHaveURL(/#education$/);
  await expect
    .poll(() =>
      page
        .getByRole('heading', { name: 'Education & skills.' })
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top)),
    )
    .toBeLessThan(180);
  await expect(
    page.getByRole('link', { name: 'VitorCCdesign@outlook.com', exact: true }),
  ).toHaveAttribute('href', 'mailto:VitorCCdesign@outlook.com');
  expect(errors).toEqual([]);
});
test('a failed remote does not prevent other sections from rendering', async ({ page }) => {
  await page.route('http://127.0.0.1:5102/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Unable to load this section');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  await page.unroute('http://127.0.0.1:5102/**');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Habit Tracker' })).toBeVisible();
});
test('mobile has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('opens a direct link and supports repeated navigation to the same section', async ({
  page,
}) => {
  await page.goto('/#education');
  const heading = page.getByRole('heading', { name: 'Education & skills.' });
  await expect(heading).toBeVisible();
  await expect
    .poll(() => heading.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThan(180);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('navigation').getByRole('link', { name: 'Education' }).click();
  await expect
    .poll(() => heading.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThan(180);
});

test('offers keyboard access to the main content and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const marquee = page
    .locator('[data-microfrontend="profile"]')
    .locator('.technology-marquee > div');
  await expect(marquee).toHaveCSS('animation-name', 'none');
});

test('recovers when the startup manifest request fails', async ({ page }) => {
  await page.route('**/microfrontends.json', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Unable to load the portfolio.');
  await page.unroute('**/microfrontends.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('fits narrow mobile screens', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
});
