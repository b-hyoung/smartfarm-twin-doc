// OpenAI 이미지 생성(gpt-image-1)으로 개념 씬을 뽑아 public/gen 에 저장.
// 키는 .env.local 에서 읽는다. 실행: node scripts/gen-images.mjs [id ...]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = readFileSync(join(root, '.env.local'), 'utf8');
const KEY = env.match(/^OPENAI_API_KEY=(.*)$/m)?.[1]?.trim();
if (!KEY) { console.error('no OPENAI_API_KEY'); process.exit(1); }

const PROMPTS = {
  why: 'A clean isometric 3D concept illustration of a smart vertical farm digital twin. Two-tier vertical grow racks with LED grow lights (magenta-pink glow), a cooling unit and a fan on the side. Semi-transparent overlays showing airflow streamlines and a temperature heatmap gradient across the space. On the right, a subtle holographic UI panel suggesting real-time data. Muted teal and warm amber accents, soft studio lighting, white background, no text, editorial tech illustration style.',
  measure: 'A technical isometric diagram of a two-tier vertical farm rack with sensor placement markers (temperature/humidity, PPFD light sensor, power meter) at representative points. Small sensor icons, a fan and a cooling unit. Blueprint-meets-3D style, teal line work on off-white background, clean and precise, no text.',
  energy: 'A minimalist energy dashboard concept: three horizontal bars for lighting, fan, and cooling power consumption, each with a simulated value and a measured value marker, plus a small line chart of power over time. Flat design, teal and amber, off-white background, no text.',
  ai: 'A minimal concept illustration with lots of white space: on the left a large slow gear-and-clock icon representing an hours-long physics simulation, a bold arrow leading into a small glowing microchip in the center, and on the right a lightning bolt beside a simple rising line chart representing instant AI prediction. Flat iconographic style, teal and amber accents, off-white background, no text, no labels.',
  light: 'A lighting simulation false-color illuminance heatmap on a horizontal grow-rack plane, smooth gradient from deep blue (low) to yellow-white (high), brighter center and dimmer corners, with faint iso-lux contour lines. Scientific software-screenshot aesthetic, dark UI frame hint, no text.',
  cfd: 'A CFD post-processing visualization: a vertical cross-section of an indoor grow space showing a temperature field as a blue-to-red color map, overlaid with white airflow velocity vector arrows curving from a fan and a cooling outlet around two grow-rack tiers. ParaView-style scientific visualization, dark background, no text.',
  ue: 'A game-engine real-time 3D visualization of a smart farm interior: vertical grow racks under magenta LED lighting, a translucent temperature cross-section plane and airflow ribbons, with a clean floating control UI panel of sliders and gauges on the side. Cinematic high-fidelity render, no text.',
};

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PROMPTS);
mkdirSync(join(root, 'public/gen'), { recursive: true });

for (const id of ids) {
  const prompt = PROMPTS[id];
  if (!prompt) { console.log(`skip ${id} (no prompt)`); continue; }
  process.stdout.write(`generating ${id}… `);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1 }),
  });
  if (!res.ok) { console.log('FAIL', res.status, (await res.text()).slice(0, 300)); continue; }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) { console.log('no image', JSON.stringify(data).slice(0, 200)); continue; }
  writeFileSync(join(root, 'public/gen', `${id}.png`), Buffer.from(b64, 'base64'));
  console.log('saved public/gen/' + id + '.png');
}
