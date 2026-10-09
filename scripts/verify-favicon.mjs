import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const ico = await fs.readFile('dist/favicon.ico');
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
let expectedOffset = 54;
for (const [index, size] of [32, 48, 96].entries()) {
  const entry = 6 + 16 * index;
  assert.equal(ico[entry], size);
  assert.equal(ico[entry + 1], size);
  assert.equal(ico.readUInt16LE(entry + 4), 1);
  assert.equal(ico.readUInt16LE(entry + 6), 32);
  const length = ico.readUInt32LE(entry + 8);
  const offset = ico.readUInt32LE(entry + 12);
  assert.equal(offset, expectedOffset);
  const frame = ico.subarray(offset, offset + length);
  assert.equal(frame.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const metadata = await sharp(frame).metadata();
  assert.equal(metadata.width, size);
  assert.equal(metadata.height, size);
  assert.equal(metadata.format, 'png');
  expectedOffset += length;
}
assert.equal(expectedOffset, ico.length);
assert.ok(ico.length < 25000);
const png = await sharp('dist/favicon-96.png').metadata();
assert.equal(png.width, 96);
assert.equal(png.height, 96);
for (const page of ['index.html', 'fr/index.html', 'ar/index.html', 'tr/index.html']) {
  const html = await fs.readFile(`dist/${page}`, 'utf8');
  assert.match(html, /<link[^>]+rel="icon"[^>]+type="image\/png"[^>]+sizes="96x96"[^>]+href="\/favicon-96\.png"/);
  assert.match(html, /<link[^>]+rel="icon"[^>]+type="image\/svg\+xml"/);
}
console.log('Favicon: valid ICO frames, 96px PNG, budget and all four locale head links verified.');
