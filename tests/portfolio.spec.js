import { test, expect } from '@playwright/test';

// Keep tests on separate ports so they can run alongside the development servers.
test.beforeEach(async ({ page }) => {
  await page.route('**/microfrontends.json', async (route) => {
    const response = await route.fetch();
    const manifest = await response.json();
    for (const name of Object.keys(manifest)) {
      const url = new URL(manifest[name]);
      if (url.hostname === '127.0.0.1' && Number(url.port) >= 5101 && Number(url.port) <= 5104) {
        url.port = String(Number(url.port) + 1000);
        manifest[name] = url.href;
      }
    }
    await route.fulfill({ response, json: manifest });
  });
});

async function waitForRuntime(page) {
  await expect(page.locator('[data-microfrontend]')).toHaveCount(4);
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
}
test('composes independently served remotes and navigates across boundaries', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await waitForRuntime(page);
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
  await page.route('http://127.0.0.1:6102/**', (route) => route.abort());
  await page.goto('/');
  await waitForRuntime(page);
  await expect(page.getByRole('alert')).toContainText('Unable to load this section');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  await page.unroute('http://127.0.0.1:6102/**');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Habit Tracker' })).toBeVisible();
});
test('mobile has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await waitForRuntime(page);
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('opens a direct link and supports repeated navigation to the same section', async ({
  page,
}) => {
  await page.goto('/#education');
  await waitForRuntime(page);
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
  await waitForRuntime(page);
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
  const abortManifest = (route) => route.abort();
  await page.route('**/microfrontends.json', abortManifest);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Unable to load the portfolio.');
  await page.unroute('**/microfrontends.json', abortManifest);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('fits narrow mobile screens', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');
  await waitForRuntime(page);
  await expect(page.getByRole('heading', { name: 'Education & skills.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true });
});

test('serves useful portfolio content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:6100');
  await expect(page.getByRole('heading', { name: 'Habit Tracker' })).toBeVisible();
  await page.getByText('Read the case study', { exact: false }).first().click();
  await expect(
    page.getByText('Separate CLI, services, repositories and models.', { exact: false }),
  ).toBeVisible();
  await context.close();
});

test('provides case study links, share metadata and a printable resume', async ({ page }) => {
  await page.goto('/');
  await waitForRuntime(page);
  await expect(page.getByRole('link', { name: /Source code for Habit Tracker/ })).toHaveAttribute(
    'href',
    'https://github.com/beltbunny05/Java-CRUD-Simple',
  );
  await page.getByText('Read the case study for Habit Tracker').click();
  await expect(
    page.getByText('The public implementation provides the CLI', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /social-card.png$/,
  );
  await expect(page.getByRole('link', { name: 'View résumé' })).toHaveAttribute(
    'href',
    '/resume.html',
  );
  await page.goto('/resume.html');
  await expect(page.getByRole('heading', { name: 'Software Engineer', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('button', { name: 'Print / Save as PDF' })).toBeHidden();
});
