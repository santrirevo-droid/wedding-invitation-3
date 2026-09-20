/**
 * One-time asset pipeline: pulls the 4 couple-illustration poses embedded in
 * Couple.pdf (each image + its soft mask) into transparent, quantized PNGs
 * in public/couple/.
 *
 * Usage: node scripts/extract-couple-pdf.mjs "<path-to-pdf>"
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "couple");

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: node scripts/extract-couple-pdf.mjs <path-to-pdf>");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

function pixmapToRawRGB(pixmap) {
  const w = pixmap.getWidth();
  const h = pixmap.getHeight();
  const stride = pixmap.getStride();
  const channels = pixmap.getNumberOfComponents();
  const px = pixmap.getPixels();
  const out = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = y * stride + x * channels;
      const di = (y * w + x) * 3;
      if (channels >= 3) {
        out[di] = px[si];
        out[di + 1] = px[si + 1];
        out[di + 2] = px[si + 2];
      } else {
        out[di] = out[di + 1] = out[di + 2] = px[si];
      }
    }
  }
  return { buf: out, w, h };
}

function pixmapToRawGray(pixmap) {
  const w = pixmap.getWidth();
  const h = pixmap.getHeight();
  const stride = pixmap.getStride();
  const channels = pixmap.getNumberOfComponents();
  const px = pixmap.getPixels();
  const out = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[y * w + x] = px[y * stride + x * channels];
    }
  }
  return { buf: out, w, h };
}

async function compositeImage(image) {
  const rgbPixmap = image.toPixmap();
  const { buf: rgbBuf, w, h } = pixmapToRawRGB(rgbPixmap);

  const maskImage = image.getMask();
  if (!maskImage) {
    return sharp(rgbBuf, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
  }

  const maskPixmap = maskImage.toPixmap();
  const mw = maskPixmap.getWidth();
  const mh = maskPixmap.getHeight();
  let { buf: alphaBuf } = pixmapToRawGray(maskPixmap);

  if (mw !== w || mh !== h) {
    alphaBuf = await sharp(alphaBuf, { raw: { width: mw, height: mh, channels: 1 } })
      .resize(w, h)
      .raw()
      .toBuffer();
  }

  const rgbaBuf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgbaBuf[i * 4] = rgbBuf[i * 3];
    rgbaBuf[i * 4 + 1] = rgbBuf[i * 3 + 1];
    rgbaBuf[i * 4 + 2] = rgbBuf[i * 3 + 2];
    rgbaBuf[i * 4 + 3] = alphaBuf[i];
  }

  return sharp(rgbaBuf, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

const buf = fs.readFileSync(pdfPath);
const doc = mupdf.Document.openDocument(buf, "application/pdf");

const rawImages = [];
for (let p = 0; p < doc.countPages(); p++) {
  const page = doc.loadPage(p);
  const tasks = [];
  page.toStructuredText("preserve-images").walk({
    onImageBlock(_bbox, _transform, image) {
      tasks.push(image);
    },
  });
  for (const image of tasks) {
    rawImages.push(await compositeImage(image));
  }
}

// Poses appear in document order, top to bottom: bouquet, exchange, akad, veil.
const NAMES = [
  "couple-bouquet.png",
  "couple-exchange.png",
  "couple-akad.png",
  "couple-veil.png",
];

if (rawImages.length !== NAMES.length) {
  console.error(`Expected ${NAMES.length} poses, found ${rawImages.length}.`);
  process.exit(1);
}

for (let i = 0; i < rawImages.length; i++) {
  const out = await sharp(rawImages[i])
    .png({ palette: true, quality: 85, effort: 10, compressionLevel: 9 })
    .toBuffer();
  const outPath = path.join(OUT_DIR, NAMES[i]);
  fs.writeFileSync(outPath, out);
  const meta = await sharp(out).metadata();
  console.log(`wrote ${NAMES[i]} (${meta.width}x${meta.height}, ${out.length} bytes)`);
}

console.log("\nDone.");
