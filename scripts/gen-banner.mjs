import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 1600;
const H = 600;
const INK = "#f5f5f5";
const MUTED = "#a3a3a3";
const HAIR = "#d4d4d4";
const M = 76;

const source = await sharp(join(root, "assets/banner-source.png"))
  .resize(W, H, { fit: "cover", position: "right" })
  .toBuffer();

const veil = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="v" x1="0" x2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.72"/>
        <stop offset="0.42" stop-color="#000" stop-opacity="0.28"/>
        <stop offset="0.72" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#v)"/>
  </svg>`,
);

const type = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="${M}" y="148" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="20" letter-spacing="6" fill="${HAIR}">LEGENDEVS.COM.BR</text>
    <text x="${M}" y="268" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="68" fill="${INK}">we design, develop</text>
    <text x="${M}" y="348" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="68" fill="${INK}">dominate<tspan fill="${HAIR}">.</tspan></text>
    <rect x="${M}" y="392" width="88" height="1.5" fill="${HAIR}"/>
    <text x="${M}" y="448" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" fill="${MUTED}">Bruno Din  ·  Software Engineer  ·  São Paulo</text>
    <text x="${M}" y="486" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="22" fill="${HAIR}">platforms, automation, results</text>
  </svg>`,
);

const out = join(root, "assets/banner.png");
const buf = await sharp(source)
  .composite([
    { input: veil, left: 0, top: 0 },
    { input: type, left: 0, top: 0 },
  ])
  .png()
  .toBuffer();

writeFileSync(out, buf);
console.log(`saved ${out} (${W}×${H})`);
