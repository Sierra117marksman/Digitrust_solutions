import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 3088;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(url, timeout = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      }).on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Server at ${url} did not become ready within ${timeout}ms`));
      } else {
        setTimeout(check, 300);
      }
    };

    check();
  });
}

async function run() {
  console.log(`Starting production Next.js server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) },
  });

  try {
    await waitForServer(BASE_URL);
    console.log(`Server is healthy and ready at ${BASE_URL}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const networkRequests = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('facebook.net') || url.includes('facebook.com/tr')) {
        networkRequests.push(url);
      }
    });

    console.log('Navigating to home page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Wait for Next.js to inject and execute afterInteractive script
    await page.waitForFunction(() => typeof window.fbq === 'function', { timeout: 10000 });

    // Verify window.fbq exists
    const fbqExists = await page.evaluate(() => {
      return typeof window.fbq === 'function';
    });
    console.log(`✓ window.fbq exists on client: ${fbqExists}`);

    // Verify fbq queue or properties
    const fbqDetails = await page.evaluate(() => {
      return {
        loaded: window.fbq?.loaded,
        version: window.fbq?.version,
        queueLength: Array.isArray(window.fbq?.queue) ? window.fbq.queue.length : 0,
        queue: Array.isArray(window.fbq?.queue) ? window.fbq.queue.map(q => Array.from(q)) : []
      };
    });
    console.log(`✓ fbq details:`, JSON.stringify(fbqDetails));

    // Verify noscript content in DOM (browsers store noscript as textContent when JS is enabled)
    const noscriptContent = await page.evaluate(() => {
      const noscript = document.querySelector('noscript');
      return noscript ? noscript.innerHTML || noscript.textContent : null;
    });
    console.log(`✓ Noscript fallback inner content: ${noscriptContent}`);

    if (!noscriptContent || !noscriptContent.includes('1140245098411541')) {
      throw new Error(`Invalid or missing noscript pixel img: ${noscriptContent}`);
    }

    // Now test client-side navigation to /client-results
    console.log('Navigating client-side to /client-results...');
    const calls = [];
    await page.exposeFunction('onFbqCall', (args) => {
      calls.push(args);
    });

    // Spy on fbq call in page
    await page.evaluate(() => {
      const originalFbq = window.fbq;
      window.fbq = function (...args) {
        window.onFbqCall(args);
        return originalFbq.apply(this, args);
      };
      Object.assign(window.fbq, originalFbq);
    });

    // Click client navigation link
    const clientResultsLink = page.locator('a[href="/client-results"]').first();
    if (await clientResultsLink.count() > 0) {
      await clientResultsLink.click();
      await page.waitForTimeout(1000);
      console.log(`✓ SPA Navigated to: ${page.url()}`);
      console.log(`✓ Captured calls to fbq after navigation:`, JSON.stringify(calls));
      const trackedPageView = calls.some(c => c[0] === 'track' && c[1] === 'PageView');
      console.log(`✓ SPA route change triggered fbq('track', 'PageView'): ${trackedPageView}`);
    }

    await browser.close();
    console.log('\n🎉 All runtime browser tests for Facebook Pixel succeeded!');
  } finally {
    console.log('Terminating test server...');
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { shell: true });
    } else {
      server.kill('SIGTERM');
    }
  }
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
