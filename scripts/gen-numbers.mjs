import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 1600;
const H = 280;
const INK = "#f5f5f5";
const MUTED = "#a3a3a3";
const HAIR = "#d4d4d4";
const DIM = "#262626";
const M = 76;

const tiles = [
  { v: "2020", l: "started" },
  { v: "20+", l: "projects delivered" },
  { v: "50+", l: "clients served" },
  { v: "10", l: "states reached" },
];

const tileSvg = tiles
  .map((t, i) => {
    const x = M + i * 380;
    return `<text x="${x}" y="148" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="64" fill="${INK}">${t.v}</text>
    <text x="${x}" y="190" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="20" fill="${MUTED}">${t.l}</text>`;
  })
  .join("\n");

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#000000"/>
  <text x="${M}" y="64" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="18" letter-spacing="5" fill="${HAIR}">LEGENDEVS / SINCE 2020</text>
  <rect x="${M}" y="86" width="${W - M * 2}" height="1" fill="${DIM}"/>
  ${tileSvg}
  <text x="${M}" y="${H - 28}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="16" fill="${DIM}">we design, develop, dominate.</text>
</svg>`;

const out = join(root, "assets/numbers.png");
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`saved ${out} (${W}×${H})`);
