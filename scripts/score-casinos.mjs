// Scores every casino on one published rubric and writes `rating` into casinos.json.
// The rubric is described to readers on /internettikasino-arvostelu/ — keep both in sync.
// Run: npm run score
//
//   Base                                                    3.0
//   Licence      EU/EEA (MGA, EMTA, Isle of Man) → tax-free +1.0
//                Curaçao                                    +0.2
//                Anjouan / unknown                          +0.0
//   Withdrawals  stated ≤ 15 min                            +0.4
//                5–30 min                                   +0.3
//                "a few minutes" (not measured precisely)   +0.2
//   Bonus        wager-free value (cashback, cash spins)    +0.4
//                match bonus + free spins / spins only      +0.3
//                match bonus only / small spin offer        +0.2
//                small (≤ 50 €) or none                     +0.0–0.1
//   Depth        full hands-on test (support chat, etc.)    +0.2
//                                                   max     5.0
import fs from 'node:fs';

const FILE = 'src/lib/data/casinos.json';
const casinos = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// Bonus quality is a judgement on the terms described in each review.
const BONUS = {
  '247bet': 0.1, // 100 % up to 50 €
  casinofriday: 0.3, // 100 free spins
  'hurmio-casino-2': 0.4, // up to 15 % cashback
  'igni-casino': 0.3, // 100 % up to 500 € + 100 FS
  jackburst: 0.3, // 100 % up to 500 € + 50 FS, 30-day wagering window
  'jellona-kasino': 0.4, // up to 15 % cashback
  kaahaus: 0.4, // 100 % cashback
  'lumo-casino': 0.4, // 100 % up to 300 € + 50 wager-free cash spins
  'munkki-kasino': 0.2, // 100 % up to 600 €
  onerush: 0, // no welcome bonus
  pelipeto: 0.2, // 50 FS at 0.10 € for a 20–49 € deposit
  'rullat-casino': 0.4, // up to 15 % cashback
  'shotz-kasino': 0.2, // 50 FS for a 20–49 € deposit
  'spiidi-kasino': 0.4, // 100 cash spins + 10 % cashback
  'spinnair-kasino': 0.4, // 200 FS + up to 20 % cashback
  spinnaus: 0.2, // 10 % cashback with 10x wagering
  'taika-spinni': 0.2, // 100 % up to 500 €
  'tikkari-kasino': 0.4, // up to 15 % cashback + up to 1000 spins
  'ursa-casino': 0.3, // 100 % up to 500 € + 200 FS
  'vauthi-kasino': 0.3, // up to 1000 € cash pot
  'pelifantti-kasino': 0.4, // up to 15 % cashback
  'tikaani-casino': 0.3, // 200 FS
};

function licencePoints(raw) {
  if (/mga|malta|eston|emta|viro|isle/i.test(raw)) return 1.0;
  if (/cura/i.test(raw)) return 0.2;
  return 0;
}

function withdrawalPoints(md) {
  const i = md.indexOf('Kotiutukset</strong>');
  const table = i < 0 ? '' : md.slice(i, i + 1500).replace(/<[^>]+>/g, '|').replace(/\|+/g, '|');
  const time = (table.match(/Käsittelyaika\|([^|]+)/i) || [])[1] || '';
  if (/välitön|^\s*(5|10) min|5–15/i.test(time)) return 0.4;
  if (/5–30/.test(time)) return 0.3;
  return 0.2;
}

const depthPoints = (md) => (md.split(/\s+/).length >= 1500 ? 0.2 : 0);

for (const c of casinos) {
  if (!(c.slug in BONUS)) throw new Error(`No bonus score for ${c.slug} — add it to BONUS`);
  const md = fs.readFileSync(`src/content/reviews/${c.slug}.md`, 'utf8');
  const score = 3 + licencePoints(c.license) + withdrawalPoints(md) + BONUS[c.slug] + depthPoints(md);
  c.rating = Math.min(5, Math.round(score * 10) / 10);
}

casinos.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'fi'));
fs.writeFileSync(FILE, JSON.stringify(casinos, null, 2) + '\n');
for (const c of casinos) console.log(c.rating.toFixed(1), c.name.padEnd(20), c.license);
