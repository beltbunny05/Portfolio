import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<html><body style="margin:0;background:#04151f;color:#f2f1eb;font-family:Arial,sans-serif"><main style="padding:70px 80px;border-bottom:14px solid #ff0054;height:476px"><div style="font-size:22px;letter-spacing:4px;margin-bottom:90px">VITOR COELHO / SOFTWARE ENGINEER</div><div style="font-size:76px;line-height:1;letter-spacing:-4px">Solid architecture,<br><span style="color:#ff0054">designed for people.</span></div><div style="margin-top:42px;font-size:22px;color:#c8c7c0">JAVA · REACT · DESIGN</div></main></body></html>`,
  );
  await page.screenshot({ path: 'apps/shell/public/social-card.png' });
} finally {
  await browser.close();
}
