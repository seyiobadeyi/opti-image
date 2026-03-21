/**
 * Converts email-icons SVG files to PNG (40x40) for email client compatibility.
 * SVG is not supported in Gmail, Yahoo, or Outlook.
 * Run from the client directory: node scripts/convert-email-icons.mjs
 */

import sharp from 'sharp';
import { readdir, readFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'email-icons');

const files = await readdir(iconsDir);
const svgs = files.filter(f => extname(f) === '.svg');

for (const svgFile of svgs) {
    const svgPath = join(iconsDir, svgFile);
    const pngPath = join(iconsDir, svgFile.replace('.svg', '.png'));
    const svgContent = await readFile(svgPath);

    await sharp(svgContent, { density: 144 })
        .resize(40, 40)
        .png({ compressionLevel: 9 })
        .toFile(pngPath);

    console.log(`Converted: ${basename(svgFile)} -> ${basename(pngPath)}`);
}

console.log(`Done. ${svgs.length} icons converted.`);
