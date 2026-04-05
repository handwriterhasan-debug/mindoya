const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const PREVIEW_URL = 'https://id-preview--f0f0d725-8ed2-4743-8d89-93df6412541c.lovable.app';
const DOWNLOAD_DIR = '/tmp/mindoya-downloads';

function isPngMostlyWhite(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Downloaded PNG is invalid');
  }
  return buffer.length < 15000;
}

(async () => {
  fs.rmSync(DOWNLOAD_DIR, { recursive: true, force: true });
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 60000 });

  const possibleStartButtons = [
    page.getByRole('button', { name: /start building/i }).first(),
    page.getByRole('button', { name: /get started/i }).first(),
    page.getByRole('button', { name: /start/i }).first(),
  ];

  let entered = false;
  for (const btn of possibleStartButtons) {
    if (await btn.count()) {
      await btn.click();
      entered = true;
      break;
    }
  }
  if (!entered) {
    throw new Error('Could not enter the builder');
  }

  await page.waitForLoadState('networkidle');

  const textInputs = page.locator('input');
  const inputCount = await textInputs.count();
  if (inputCount > 0) await textInputs.nth(0).fill('Hasan Test');
  if (inputCount > 1) await textInputs.nth(1).fill('Designer');
  const email = page.locator('input[type="email"]').first();
  if (await email.count()) await email.fill('hasan@example.com');
  const textarea = page.locator('textarea').first();
  if (await textarea.count()) await textarea.fill('Creative product designer and frontend engineer with experience building premium resume products.');

  await page.getByRole('button', { name: /^export$/i }).first().click();

  const pngBtn = page.getByRole('button', { name: /download png/i }).first();
  await pngBtn.waitFor({ state: 'visible', timeout: 20000 });

  const [pngDownload] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    pngBtn.click(),
  ]);
  const pngPath = path.join(DOWNLOAD_DIR, 'resume.png');
  await pngDownload.saveAs(pngPath);
  const pngBuffer = fs.readFileSync(pngPath);
  if (isPngMostlyWhite(pngBuffer)) {
    throw new Error('PNG export still looks blank/minimal');
  }

  const exportAgain = page.getByRole('button', { name: /export again/i }).first();
  if (await exportAgain.count()) await exportAgain.click();

  const pdfBtn = page.getByRole('button', { name: /download pdf/i }).first();
  await pdfBtn.waitFor({ state: 'visible', timeout: 20000 });

  const [pdfDownload] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    pdfBtn.click(),
  ]);
  const pdfPath = path.join(DOWNLOAD_DIR, 'resume.pdf');
  await pdfDownload.saveAs(pdfPath);
  const pdfStat = fs.statSync(pdfPath);
  if (pdfStat.size < 25000) {
    throw new Error('PDF export is unexpectedly tiny and may be blank');
  }

  console.log(JSON.stringify({ pngBytes: pngBuffer.length, pdfBytes: pdfStat.size, pngPath, pdfPath }, null, 2));
  await browser.close();
})();
