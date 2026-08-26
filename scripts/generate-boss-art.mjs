// Generates local fallback artwork (SVG) for every curated boss in
// lib/bosses.ts. Run once with: node scripts/generate-boss-art.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "lib", "bosses.ts"), "utf8");

const ELEMENT_COLORS = {
  Anemo: "#5fbfae",
  Geo: "#e0a94e",
  Electro: "#a98fd6",
  Dendro: "#9cc94b",
  Hydro: "#52b7e8",
  Pyro: "#e8823f",
  Cryo: "#9ed2e4",
};
const DEFAULT_COLOR = "#8f99aa";

const ENTRY = /\{ id: "([^"]+)", name: "([^"]+)", region: "[^"]+"(?:, element: "([^"]+)")?/g;

function initialsOf(name) {
  const stop = new Set(["of", "the", "and"]);
  const words = name.split(/\s+/).filter((w) => w && !stop.has(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

function svgFor(id, name, element) {
  const color = ELEMENT_COLORS[element] ?? DEFAULT_COLOR;
  const initials = escapeXml(initialsOf(name));
  const label = escapeXml((element ?? "Boss").toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" role="img" aria-label="${escapeXml(name)} artwork">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#101826"/>
      <stop offset="1" stop-color="#0a0f18"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.44" r="0.6">
      <stop offset="0" stop-color="${color}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1dca8"/>
      <stop offset="1" stop-color="#c9a85c"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </radialGradient>
    <pattern id="hatch" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="28" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <rect width="800" height="500" fill="url(#hatch)"/>
  <rect width="800" height="500" fill="url(#glow)"/>
  <g transform="translate(400 238)">
    <rect x="-98" y="-98" width="196" height="196" transform="rotate(45)" fill="${color}" opacity="0.09"/>
    <rect x="-98" y="-98" width="196" height="196" transform="rotate(45)" fill="none" stroke="url(#gold)" stroke-opacity="0.85" stroke-width="2.5"/>
    <rect x="-80" y="-80" width="160" height="160" transform="rotate(45)" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-width="1.5"/>
  </g>
  <text x="400" y="282" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="112" font-weight="600" letter-spacing="10" fill="url(#gold)">${initials}</text>
  <text x="400" y="356" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="12" fill="${color}" fill-opacity="0.85">${label}</text>
  <rect width="800" height="500" fill="url(#vignette)"/>
</svg>
`;
}

const outDir = join(root, "public", "bosses");
mkdirSync(outDir, { recursive: true });

let count = 0;
for (const match of source.matchAll(ENTRY)) {
  const [, id, name, element] = match;
  writeFileSync(join(outDir, `${id}.svg`), svgFor(id, name, element));
  count += 1;
}
console.log(`Generated ${count} boss artwork SVGs in public/bosses`);
