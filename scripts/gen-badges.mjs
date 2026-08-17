import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const INK = "#f5f5f5";
const HAIR = "#d4d4d4";
const BORDER = "#2a2a2a";
const BG = "#0a0a0a";

const ICONS = {
  globe: {
    kind: "stroke",
    body: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>`,
  },
  linkedin: {
    kind: "fill",
    body: `<path d="M4 4h4v16H4zM6 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 8h3.8v2.2h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V20h-4v-5.7c0-1.36-.03-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3v5.8h-4V8z"/>`,
  },
  mail: {
    kind: "stroke",
    body: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>`,
  },
  whatsapp: {
    kind: "stroke",
    body: `<path d="M20 11.5A8.5 8.5 0 0 1 7.2 18.4L4 20l1.7-3.1A8.5 8.5 0 1 1 20 11.5z"/><path d="M9.2 9.4c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.4.2.5.6 1.6.6 1.7 0 .2 0 .3-.1.5l-.4.5c-.1.1-.2.3 0 .5.2.3.8 1.2 1.7 1.9 1.1.8 1.3.6 1.6.5l.6-.3c.2-.1.4 0 .5.1l1.2 1.4c.1.2.2.4 0 .6-.2.3-.8.8-1.4.9-.5.1-1.2.1-2-.3-1.9-.9-3.2-2.4-3.7-3.1-.6-.8-1.1-1.8-1.1-2.6 0-.7.4-1.1.6-1.3z"/>`,
  },
};

const BADGES = [
  { out: "site", icon: "globe", label: "legendevs.com.br", accent: true },
  { out: "linkedin", icon: "linkedin", label: "in/brunodin" },
  { out: "email", icon: "mail", label: "bruno@legendevs.com.br" },
  { out: "whatsapp", icon: "whatsapp", label: "WhatsApp" },
];

const SCALE = 3;
const H = 34 * SCALE;
const PAD = 15 * SCALE;
const GAP = 9 * SCALE;
const ICON = 15 * SCALE;
const FONT = 13.5 * SCALE;
const CHAR = FONT * 0.58;

for (const b of BADGES) {
  const color = b.accent ? HAIR : INK;
  const textW = Math.ceil(b.label.length * CHAR);
  const W = PAD * 2 + ICON + GAP + textW;
  const icon = ICONS[b.icon];
  const iconAttrs =
    icon.kind === "fill"
      ? `fill="${color}" stroke="none"`
      : `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${H / 2}" fill="${BG}" stroke="${b.accent ? HAIR : BORDER}" stroke-width="2"/>
    <g transform="translate(${PAD}, ${(H - ICON) / 2}) scale(${ICON / 24})" ${iconAttrs}>${icon.body}</g>
    <text x="${PAD + ICON + GAP}" y="${H / 2}" dominant-baseline="central" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${FONT}" fill="${color}">${b.label}</text>
  </svg>`;

  const out = join(root, `assets/badge-${b.out}.png`);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`saved ${out} (${W}×${H})`);
}
