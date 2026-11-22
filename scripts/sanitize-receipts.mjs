import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

const INPUT_DIR = "C:/Users/Ravi/Downloads/Digitrust videos/Digitrust paymet receipt";
const OUTPUT_DIR = "c:/Users/Ravi/Downloads/Adybaba/Digitrust solutions/public/images/receipts";

await fs.mkdir(OUTPUT_DIR, { recursive: true });

function createSvgBox({ width, height, fill = "#ffffff", rx = 6, children = "" }) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" rx="${rx}" fill="${fill}"/>
      ${children}
    </svg>
  `);
}

// -------------------------------------------------------------
// RECEIPT 1: IMG_3503.PNG (₹999 PhonePe - Saffron Academy)
// -------------------------------------------------------------
async function processReceipt1() {
  console.log("Processing Receipt 1 (IMG_3503.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3503.PNG");
  const cropTop = 465;
  const cropHeight = 645;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // Recipient Name + UPI block: covers X:115..415, Y:155..235 (leaves ₹999 completely untouched)
    {
      input: createSvgBox({
        width: 300,
        height: 80,
        fill: "#17161b",
        rx: 6,
        children: `
          <text x="12" y="32" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="700" fill="#ffffff">DIGITRUST</text>
          <text x="12" y="60" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">••••8506-2@ibl</text>
        `
      }),
      left: 115,
      top: 155
    },
    // Banking name : TARUN -> Banking name : DIGITRUST SOLUTIONS
    {
      input: createSvgBox({
        width: 380,
        height: 38,
        fill: "#17161b",
        rx: 4,
        children: `
          <text x="8" y="25" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="500" fill="#94a3b8">Banking name : <tspan font-weight="700" fill="#ffffff">DIGITRUST SOLUTIONS</tspan></text>
        `
      }),
      left: 50,
      top: 242
    },
    // PhonePe Transaction ID
    {
      input: createSvgBox({
        width: 360,
        height: 32,
        fill: "#17161b",
        rx: 4,
        children: `
          <text x="8" y="22" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="500" fill="#94a3b8">T261024••••••••••••••••</text>
        `
      }),
      left: 55,
      top: 382
    },
    // Debited from XXXXXX8151 UTR: 901002865736
    {
      input: createSvgBox({
        width: 310,
        height: 80,
        fill: "#17161b",
        rx: 4,
        children: `
          <text x="8" y="28" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#ffffff">XXXXXX••••</text>
          <text x="8" y="60" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">UTR: ••••••••••••</text>
        `
      }),
      left: 110,
      top: 450
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-1.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-1.png"));
}

// -------------------------------------------------------------
// RECEIPT 2: IMG_3504.PNG (₹5,000 Paytm - Advance Payment)
// -------------------------------------------------------------
async function processReceipt2() {
  console.log("Processing Receipt 2 (IMG_3504.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3504.PNG");
  const cropTop = 250;
  const cropHeight = 920;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // UPI ID: 9266588506-2@ibl -> UPI ID: ••••••••••@ibl
    {
      input: createSvgBox({
        width: 270,
        height: 32,
        fill: "#f0f9ff",
        rx: 6,
        children: `
          <text x="135" y="22" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="600" fill="#0369a1" text-anchor="middle">UPI ID: ••••••••••@ibl</text>
        `
      }),
      left: 140,
      top: 145
    },
    // Ref. No: 617301395974 -> Ref. No: ••••••••••••
    {
      input: createSvgBox({
        width: 240,
        height: 28,
        fill: "#f8fafc",
        rx: 4,
        children: `
          <text x="120" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="500" fill="#64748b" text-anchor="middle">Ref. No: ••••••••••••</text>
        `
      }),
      left: 230,
      top: 300
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-2.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-2.png"));
}

// -------------------------------------------------------------
// RECEIPT 3: IMG_3505.PNG (₹1,000 Navi UPI - Campaign Advance)
// -------------------------------------------------------------
async function processReceipt3() {
  console.log("Processing Receipt 3 (IMG_3505.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3505.PNG");
  const cropTop = 190;
  const cropHeight = 1090;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // to TARUN -> to DIGITRUST
    {
      input: createSvgBox({
        width: 140,
        height: 28,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="70" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700" fill="#0f172a" text-anchor="middle">to DIGITRUST</text>
        `
      }),
      left: 210,
      top: 200
    },
    // ******8506-2@ibl -> ••••8506@ibl
    {
      input: createSvgBox({
        width: 150,
        height: 24,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="75" y="17" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">••••8506@ibl</text>
        `
      }),
      left: 215,
      top: 236
    },
    // from ANURAG ROY -> from Verified Client
    {
      input: createSvgBox({
        width: 220,
        height: 26,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="110" y="19" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="#0f172a" text-anchor="middle">from Verified Client</text>
        `
      }),
      left: 175,
      top: 505
    },
    // Slice Small Finance Bank - 0558 -> Verified Bank •••••0558
    {
      input: createSvgBox({
        width: 280,
        height: 24,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="140" y="17" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">Verified Bank •••••0558</text>
        `
      }),
      left: 155,
      top: 535
    },
    // UPI txn ID : 006946934312 -> UPI txn ID : ••••••••••••
    {
      input: createSvgBox({
        width: 280,
        height: 24,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="140" y="17" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">UPI txn ID : ••••••••••••</text>
        `
      }),
      left: 155,
      top: 575
    },
    // Chat bubble text: 'ANURAG ROY' -> 'Verified Client'
    {
      input: createSvgBox({
        width: 235,
        height: 36,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="10" y="26" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="400" fill="#0f172a">Verified Client</text>
        `
      }),
      left: 55,
      top: 665
    },
    // Chat bubble text: 'to TARUN' -> 'to Agency'
    {
      input: createSvgBox({
        width: 130,
        height: 32,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="8" y="24" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="400" fill="#0f172a">Agency</text>
        `
      }),
      left: 88,
      top: 710
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-3.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-3.png"));
}

// -------------------------------------------------------------
// RECEIPT 4: IMG_3506.PNG (₹2,800 Navi UPI - Service Payment)
// -------------------------------------------------------------
async function processReceipt4() {
  console.log("Processing Receipt 4 (IMG_3506.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3506.PNG");
  const cropTop = 190;
  const cropHeight = 1085;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // to HITESH -> to DIGITRUST
    {
      input: createSvgBox({
        width: 200,
        height: 28,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="100" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700" fill="#0f172a" text-anchor="middle">to DIGITRUST</text>
        `
      }),
      left: 210,
      top: 188
    },
    // ******4258@ptsbi -> ••••4258@ptsbi
    {
      input: createSvgBox({
        width: 220,
        height: 24,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="110" y="17" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">••••4258@ptsbi</text>
        `
      }),
      left: 210,
      top: 220
    },
    // from INDERPAL SINGH -> from Verified Client
    {
      input: createSvgBox({
        width: 350,
        height: 28,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="175" y="20" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="600" fill="#0f172a" text-anchor="middle">from Verified Client</text>
        `
      }),
      left: 150,
      top: 525
    },
    // Karnataka Bank - 8901 -> Verified Bank •••••8901
    {
      input: createSvgBox({
        width: 350,
        height: 26,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="175" y="18" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">Verified Bank •••••8901</text>
        `
      }),
      left: 150,
      top: 555
    },
    // UPI txn ID : 007130637092 -> UPI txn ID : ••••••••••••
    {
      input: createSvgBox({
        width: 350,
        height: 28,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="175" y="19" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="middle">UPI txn ID : ••••••••••••</text>
        `
      }),
      left: 150,
      top: 595
    },
    // Chat bubble: 'INDERPAL SINGH paid' -> covers INDERPAL SINGH (X: 55..395)
    {
      input: createSvgBox({
        width: 340,
        height: 34,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="8" y="25" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="400" fill="#0f172a">Verified Client</text>
        `
      }),
      left: 55,
      top: 658
    },
    // Chat bubble: 'to HITESH via' -> covers HITESH (X: 245..395)
    {
      input: createSvgBox({
        width: 150,
        height: 34,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="75" y="25" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="400" fill="#0f172a" text-anchor="middle">Agency</text>
        `
      }),
      left: 245,
      top: 702
    },
    // Chat reply sender name: 'hitesh yadav' -> 'Digitrust Support'
    {
      input: createSvgBox({
        width: 210,
        height: 32,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="8" y="23" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#0284c7">Digitrust Support</text>
        `
      }),
      left: 110,
      top: 1008
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-4.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-4.png"));
}

// -------------------------------------------------------------
// RECEIPT 5: IMG_3507.PNG (₹1,999 PhonePe - Campaign Start)
// -------------------------------------------------------------
async function processReceipt5() {
  console.log("Processing Receipt 5 (IMG_3507.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3507.PNG");
  const cropTop = 230;
  const cropHeight = 1330;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // TARUN + UPI in green card: covers X:150..430, Y:50..105
    {
      input: createSvgBox({
        width: 280,
        height: 55,
        fill: "#ffffff",
        rx: 4,
        children: `
          <text x="8" y="24" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17" font-weight="700" fill="#0f172a">DIGITRUST SOLUTIONS</text>
          <text x="8" y="46" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="500" fill="#64748b">••••8506-2@ibl</text>
        `
      }),
      left: 150,
      top: 50
    },
    // +91 93399 11376 ~Raiza... -> Verified Client • Order Confirmation
    {
      input: createSvgBox({
        width: 440,
        height: 46,
        fill: "#f0fdf4",
        rx: 6,
        children: `
          <text x="220" y="30" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="17" font-weight="600" fill="#047857" text-anchor="middle">Verified Client • Order Confirmation</text>
        `
      }),
      left: 70,
      top: 675
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-5.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-5.png"));
}

// -------------------------------------------------------------
// RECEIPT 6: IMG_3508.PNG (₹1,000 PhonePe - "Already started sir")
// -------------------------------------------------------------
async function processReceipt6() {
  console.log("Processing Receipt 6 (IMG_3508.PNG)...");
  const input = path.join(INPUT_DIR, "IMG_3508.PNG");
  const cropTop = 270;
  const cropHeight = 960;
  const cropped = await sharp(input)
    .extract({ left: 0, top: cropTop, width: 750, height: cropHeight })
    .toBuffer();

  const overlays = [
    // Covers TARUN + PhonePe • 9266588506-2@ibl in a clean unified phone card box
    {
      input: createSvgBox({
        width: 360,
        height: 85,
        fill: "#0f1117",
        rx: 6,
        children: `
          <text x="180" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700" fill="#f3f4f6" text-anchor="middle">DIGITRUST</text>
          <text x="180" y="64" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="500" fill="#9ca3af" text-anchor="middle">PhonePe • ••••••••@ibl</text>
        `
      }),
      left: 140,
      top: 295
    }
  ];

  await sharp(cropped).composite(overlays).webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, "receipt-6.webp"));
  await sharp(cropped).composite(overlays).png().toFile(path.join(OUTPUT_DIR, "receipt-6.png"));
}

async function run() {
  await processReceipt1();
  await processReceipt2();
  await processReceipt3();
  await processReceipt4();
  await processReceipt5();
  await processReceipt6();
  console.log("All 6 payment receipts sanitized and generated successfully!");
}

run().catch(console.error);
