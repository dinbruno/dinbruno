import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets", "projects");

const SHOTS = [
  { file: "blue-sea", url: "https://blueseahotel.com.br" },
  { file: "houser", url: "https://houser.com", wait: 4000 },
  { file: "linzmeyer", url: "https://linzmeyer-website.vercel.app/", wait: 2800 },
  { file: "verifica", url: "https://apps.apple.com/br/app/verifica/id6754730030" },
  { file: "genio-pro", url: "https://portal.geniopro.com.br" },
  { file: "aram-trust", url: "https://aramtrust.com.br", wait: 7000, scroll: true },
  { file: "quidin", url: "https://quidin.com.br", wait: 4000 },
  { file: "teteach", url: "https://teteach.legendevs.com.br" },
  { file: "tca", url: "https://www.tcatransportes.com.br/" },
  { file: "force-yachts", url: "https://forceyachts.com/" },
  { file: "memorizu", url: "https://memorizu.com.br/" },
  { file: "unica", url: "https://www.unicamineracao.com.br/" },
  { file: "hotel-do-valle", url: "https://www.hoteldovalle.com.br/" },
  { file: "colegio-espaco", url: "https://www.colegioespaco.com.br/", wait: 5000 },
  { file: "vidrofort", url: "https://www.vidrofort.com.br/" },
];

const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars", "--window-size=1440,900"],
});

const only = new Set(process.argv.slice(2));
const selected = only.size ? SHOTS.filter((shot) => only.has(shot.file)) : SHOTS;

for (const shot of selected) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  try {
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await new Promise((resolve) => setTimeout(resolve, shot.wait || 2500));
    const contexts = [page, ...page.frames()];
    for (const context of contexts) {
      const dismissed = await context
        .evaluate(() => {
          const labels = ["rejeitar todos", "reject all", "aceitar todos", "accept all"];
          const nodes = [...document.querySelectorAll("button, a, [role='button'], span, div")];
          const hit = nodes.find((node) => {
            const text = (node.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
            return text.length > 0 && text.length < 32 && labels.some((label) => text.includes(label));
          });
          if (!hit) return false;
          hit.click();
          return true;
        })
        .catch(() => false);
      if (dismissed) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    await page.evaluate(() => {
      const markers = ["controle sua privacidade", "this website uses cookies"];
      const nodes = [...document.querySelectorAll("div, section, aside")].filter((node) => {
        const text = (node.textContent || "").toLowerCase();
        return markers.some((marker) => text.includes(marker));
      });
      nodes.sort((a, b) => a.textContent.length - b.textContent.length);
      if (nodes[0]) nodes[0].style.setProperty("display", "none", "important");
    });
    if (shot.scroll) {
      await page.evaluate(() => window.scrollBy(0, Math.round(window.innerHeight * 0.85)));
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    const raw = await page.screenshot({ type: "jpeg", quality: 82 });
    const out = join(outDir, `${shot.file}.jpg`);
    await sharp(raw)
      .resize(1200, 750, { fit: "cover", position: "top" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    console.log(`saved ${shot.file}`);
  } catch (error) {
    console.error(`failed ${shot.file}: ${error.message}`);
  }
  await page.close();
}

await browser.close();
