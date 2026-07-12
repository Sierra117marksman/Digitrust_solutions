import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = 'C:\\Users\\Ravi\\Downloads\\tarunyadav pic.png';
const outputPath = path.join(__dirname, 'public', 'team-ceo.webp');

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
