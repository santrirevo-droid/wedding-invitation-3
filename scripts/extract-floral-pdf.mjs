/**
 * One-time asset pipeline: pulls the watercolor floral artwork embedded in a
 * wedding-invitation PDF (each image + its soft mask) into transparent PNGs,
 * dedupes identical assets, crops a couple of small petal cutouts, and
 * quantizes everything (pngquant-equivalent) into public/floral/.
 *
 * Usage: node scripts/extract-floral-pdf.mjs "<path-to-pdf>"
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "floral");

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: node scripts/extract-floral-pdf.mjs <path-to-pdf>");
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

// --- Extract every embedded image + soft mask, composited to transparent PNG ---
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

// --- Dedupe byte-identical assets (mirrored pairs share one source image) ---
const seen = new Map();
for (const png of rawImages) {
  const hash = crypto.createHash("sha256").update(png).digest("hex");
  if (!seen.has(hash)) seen.set(hash, png);
}
const unique = [...seen.values()];

// Each unique asset in this specific PDF has a distinct pixel size — map by
// dimensions rather than byte size (which shifts with encoder settings).
const NAME_BY_SIZE = {
  "744x711": "floral-wc-wreath.png",
  "302x424": "floral-wc-spray-a.png",
  "571x509": "floral-wc-spray-b.png",
  "324x321": "floral-wc-spray-c.png",
  "529x466": "floral-wc-spray-d.png",
  "585x579": "floral-wc-spray-e.png",
};

const quantized = {};
for (const png of unique) {
  const meta = await sharp(png).metadata();
  const key = `${meta.width}x${meta.height}`;
  const name = NAME_BY_SIZE[key];
  if (!name) {
    console.error(`Unrecognized extracted image size ${key} — update NAME_BY_SIZE.`);
    process.exit(1);
  }
  const out = await sharp(png)
    .png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(OUT_DIR, name), out);
  quantized[name] = out;
  console.log(`wrote ${name} (${out.length} bytes)`);
}

if (Object.keys(quantized).length !== Object.keys(NAME_BY_SIZE).length) {
  console.error("Some expected assets were not found in the PDF.");
  process.exit(1);
}

// --- Crop two small petal cutouts for the petal-fall effect ---
const wreathBuf = quantized["floral-wc-wreath.png"];
const wreathMeta = await sharp(wreathBuf).metadata();

const petalCrops = [
  { name: "floral-wc-petal-1.png", left: 0.62, top: 0.02, size: 0.14 },
  { name: "floral-wc-petal-2.png", left: 0.05, top: 0.64, size: 0.12 },
];

for (const crop of petalCrops) {
  const size = Math.round(wreathMeta.width * crop.size);
  const left = Math.round(wreathMeta.width * crop.left);
  const top = Math.round(wreathMeta.height * crop.top);
  const outPath = path.join(OUT_DIR, crop.name);
  const out = await sharp(wreathBuf)
    .extract({ left, top, width: size, height: size })
    .png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(outPath, out);
  console.log(`wrote ${crop.name} (${out.length} bytes)`);
}

console.log("\nDone.");
