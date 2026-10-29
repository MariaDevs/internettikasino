// Generates every site icon from one SVG — the yellow "iK" mark used in the header.
// Outputs are committed, so this only needs re-running when the mark changes.
// Run: npm run icons
import fs from 'node:fs';
import sharp from 'sharp';

// Colours match --color-accent-400 / --color-brand-950 in globals.css.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#fbbf24"/>
  <text x="256" y="262" text-anchor="middle" dominant-baseline="central"
    font-family="Inter, 'Segoe UI', Arial, Helvetica, sans-serif" font-weight="800"
    font-size="270" letter-spacing="-10" fill="#0a1b3f">iK</text>
</svg>
`;

const png = (size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

/** Minimal .ico: one PNG-encoded image (supported by all current browsers). */
function ico(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(6 + 16, 12); // data offset
  return Buffer.concat([header, entry, pngBuf]);
}

fs.writeFileSync('src/app/icon.svg', svg);
fs.writeFileSync('src/app/favicon.ico', ico(await png(48), 48));
fs.writeFileSync('src/app/apple-icon.png', await png(180));
fs.writeFileSync('public/images/logo-icon-512.png', await png(512));
console.log('icons: src/app/icon.svg, favicon.ico, apple-icon.png, public/images/logo-icon-512.png');
