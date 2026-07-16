/* eslint-disable */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = 'C:\\Users\\Ravi\\.gemini\\antigravity\\brain\\9f6bc6c4-3cc5-4e99-b90f-777b88633e0d\\media__1783877318436.jpg';
const outputPath = path.join(__dirname, 'public', 'team-dev.webp');

async function optimizeImage() {
  try {
    console.log(`Reading image from: ${inputPath}`);
    await sharp(inputPath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'attention'
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Image successfully optimized and saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeImage();
