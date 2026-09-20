/**
 * One-time asset pipeline: rasterizes the vector floral pattern in BG.pdf
 * (no embedded raster images — it's drawn paths), crops out the solid pink
 * card from the surrounding canvas + decorative bleed strokes, and writes a
 * quantized PNG to public/bg-pattern.png for use as the site's fixed
 * background.
 *
 * Usage: node scripts/extract-bg-pattern.mjs "<path-to-pdf>"
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "public", "bg-pattern.png");

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: node scripts/extract-bg-pattern.mjs <path-to-pdf>");
  process.exit(1);
}

const SCALE = 3;

const buf = fs.readFileSync(pdfPath);
const doc = mupdf.Document.openDocument(buf, "application/pdf");
const page = doc.loadPage(0);

const matrix = mupdf.Matrix.scale(SCALE, SCALE);
const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, true);
const fullPng = Buffer.from(pixmap.asPNG());

const full = sharp(fullPng).ensureAlpha();
const meta = await full.metadata();
const { data } = await full.raw().toBuffer({ resolveWithObject: true });
const w = meta.width;
const h = meta.height;

function isWhiteish(r, g, b) {
  return r > 248 && g > 248 && b > 248;
}

// Find the solid-color card's left/right edges from the middle row (no
// sideways bleed in this artwork).
const midY = Math.floor(h / 2);
let left = 0;
let right = w - 1;
for (let x = 0; x < w; x++) {
  const i = (midY * w + x) * 4;
  if (!isWhiteish(data[i], data[i + 1], data[i + 2])) {
    left = x;
    break;
  }
}
for (let x = w - 1; x >= 0; x--) {
  const i = (midY * w + x) * 4;
  if (!isWhiteish(data[i], data[i + 1], data[i + 2])) {
    right = x;
    break;
  }
}

// Find top/bottom via row-majority fill (ignores the thin decorative
// strokes that bleed above/below the card's real edge).
function rowFillFraction(y) {
  let count = 0;
  let samples = 0;
  for (let x = left; x < right; x += 2) {
    const i = (y * w + x) * 4;
    samples++;
    if (!isWhiteish(data[i], data[i + 1], data[i + 2])) count++;
  }
  return count / samples;
}

let top = 0;
let bottom = h - 1;
for (let y = 0; y < h; y++) {
  if (rowFillFraction(y) > 0.95) {
    top = y;
    break;
  }
}
for (let y = h - 1; y >= 0; y--) {
  if (rowFillFraction(y) > 0.95) {
    bottom = y;
    break;
  }
}

console.log("crop box:", { left, top, width: right - left, height: bottom - top });

await sharp(fullPng)
  .extract({ left, top, width: right - left, height: bottom - top })
  .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
  .toFile(OUT_PATH);

const outMeta = await sharp(OUT_PATH).metadata();
console.log(`wrote ${OUT_PATH} (${outMeta.width}x${outMeta.height})`);
