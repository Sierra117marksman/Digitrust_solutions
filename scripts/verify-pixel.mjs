import fs from 'node:fs';

const pages = [
  { name: 'index.html', path: '.next/server/app/index.html' },
  { name: 'client-results.html', path: '.next/server/app/client-results.html' }
];

let allPassed = true;

for (const page of pages) {
  console.log(`Checking ${page.name}...`);
  const html = fs.readFileSync(page.path, 'utf8');

  const checks = {
    'Contains Pixel ID 2173995326809385': html.includes('2173995326809385'),
    'Contains fbevents.js source URL': html.includes('connect.facebook.net/en_US/fbevents.js'),
    'Contains fbq init call': html.includes("fbq('init', '2173995326809385')"),
    'Contains fbq PageView track call': html.includes("fbq('track', 'PageView')"),
    'Contains noscript tracking pixel img':
      html.includes('https://www.facebook.com/tr?id=2173995326809385&amp;ev=PageView&amp;noscript=1') ||
      html.includes('https://www.facebook.com/tr?id=2173995326809385&ev=PageView&noscript=1')
  };

  for (const [desc, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? '✓' : '✗'} ${desc}`);
    if (!passed) allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n❌ Pixel verification checks failed!');
  process.exit(1);
} else {
  console.log('\n✅ All Meta Pixel checks passed successfully in production build output!');
}
