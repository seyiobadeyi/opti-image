/**
 * Regenerates all favicon / app-icon PNGs using the brand orange (#db5a42).
 * Run from the client/ directory:
 *   node scripts/gen-favicon.mjs
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

// ── SVG template ──────────────────────────────────────────────────────────────
// Simple "O" badge: white letter on brand-orange rounded-square background.
// Works cleanly at all sizes from 16×16 upwards.
function makeSvg(size) {
    const radius = Math.round(size * 0.22);  // ~22% corner radius
    const fontSize = Math.round(size * 0.58);
    const yOffset = Math.round(size * 0.72);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#db5a42"/>
  <text
    x="${size / 2}"
    y="${yOffset}"
    font-family="Arial Black, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="900"
    fill="#ffffff"
    text-anchor="middle"
    letter-spacing="-1">O</text>
</svg>`;
}

const jobs = [
    { name: 'favicon-16x16.png',          size: 16  },
    { name: 'favicon-32x32.png',          size: 32  },
    { name: 'apple-touch-icon.png',       size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
];

for (const job of jobs) {
    const svg = makeSvg(job.size);
    const outPath = path.join(PUBLIC, job.name);
    await sharp(Buffer.from(svg))
        .png()
        .toFile(outPath);
    console.log(`✓ ${job.name} (${job.size}×${job.size})`);
}

// ── favicon.ico: embed the 32×32 PNG ─────────────────────────────────────────
// A single-size ICO is just a PNG wrapped in a minimal ICO header.
// Most modern browsers ignore .ico if a PNG favicon is declared.
const png32Buffer = await sharp(Buffer.from(makeSvg(32))).png().toBuffer();

// Build a minimal ICO file with one 32×32 image entry
const HEADER_SIZE = 6;
const DIR_ENTRY_SIZE = 16;
const offset = HEADER_SIZE + DIR_ENTRY_SIZE;

const header = Buffer.alloc(HEADER_SIZE);
header.writeUInt16LE(0, 0);      // reserved
header.writeUInt16LE(1, 2);      // type: 1 = ICO
header.writeUInt16LE(1, 4);      // image count

const dir = Buffer.alloc(DIR_ENTRY_SIZE);
dir.writeUInt8(32, 0);           // width (0 means 256 — use 32)
dir.writeUInt8(32, 1);           // height
dir.writeUInt8(0, 2);            // color count
dir.writeUInt8(0, 3);            // reserved
dir.writeUInt16LE(1, 4);         // planes
dir.writeUInt16LE(32, 6);        // bits per pixel
dir.writeUInt32LE(png32Buffer.length, 8);    // image data size
dir.writeUInt32LE(offset, 12);   // image data offset

import { writeFileSync } from 'fs';
const icoPath = path.join(PUBLIC, 'favicon.ico');
writeFileSync(icoPath, Buffer.concat([header, dir, png32Buffer]));
console.log(`✓ favicon.ico (32×32, ICO wrapper)`);

console.log('\nAll favicon assets regenerated with brand orange (#db5a42).');
