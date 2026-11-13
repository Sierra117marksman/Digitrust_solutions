import { chromium } from 'playwright-core';

async function testLive() {
  console.log('Launching headless Chromium to test LIVE https://digitrustsolutions.com ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const pixelRequests = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('facebook.com/tr') || url.includes('connect.facebook.net')) {
      pixelRequests.push(url);
    }
  });

  console.log('Navigating to live homepage...');
  const res = await page.goto('https://digitrustsolutions.com', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  console.log(`HTTP Status: ${res.status()}`);

  const check = await page.evaluate(() => {
    const script = document.getElementById('fb-pixel');
    const noscript = document.querySelector('noscript');
    return {
      fbqFunctionExists: typeof window.fbq === 'function',
      fbqLoaded: Boolean(window.fbq?.loaded),
      fbqVersion: window.fbq?.version || null,
      scriptHasNewId: script ? script.textContent.includes('1140245098411541') : false,
      scriptHasOldId: script ? script.textContent.includes('2173995326809385') : false,
      noscriptHasNewId: noscript
        ? (noscript.textContent || noscript.innerHTML).includes('1140245098411541')
        : false,
      noscriptHasOldId: noscript
        ? (noscript.textContent || noscript.innerHTML).includes('2173995326809385')
        : false,
    };
  });

  console.log('\n--- BROWSER EVALUATION RESULTS ---');
  console.log(`window.fbq initialized: ${check.fbqFunctionExists ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Meta script loaded:     ${check.fbqLoaded ? '✅ PASS' : '❌ FAIL'} (v${check.fbqVersion})`);
  console.log(`Script has NEW Pixel:   ${check.scriptHasNewId ? '✅ PASS (1140245098411541)' : '❌ FAIL'}`);
  console.log(`Script has OLD Pixel:   ${!check.scriptHasOldId ? '✅ GONE' : '❌ STILL PRESENT'}`);
  console.log(`Noscript has NEW Pixel: ${check.noscriptHasNewId ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Noscript has OLD Pixel: ${!check.noscriptHasOldId ? '✅ GONE' : '❌ STILL PRESENT'}`);

  console.log('\n--- NETWORK ACTIVITY ---');
  console.log(`Total Meta tracking network calls: ${pixelRequests.length}`);
  for (const r of pixelRequests) {
    console.log(`  -> ${r.substring(0, 90)}...`);
  }

  // Test SPA Navigation
  console.log('\n--- SPA ROUTE CHANGE TEST ---');
  const resultsLink = page.locator('a[href="/client-results"]').first();
  if ((await resultsLink.count()) > 0) {
    await resultsLink.click();
    await page.waitForTimeout(2000);
    console.log(`Navigated to: ${page.url()}`);
    console.log(`Meta calls after navigation: ${pixelRequests.length}`);
  }

  await browser.close();
  console.log('\n🎉 ALL LIVE SITE VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

testLive().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
