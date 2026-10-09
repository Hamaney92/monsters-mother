import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(fs.readFileSync('src/data/turkish-fonts.json','utf8'));
const css=fs.readFileSync('src/styles/fonts.css','utf8');
assert.deepEqual(manifest.codepoints,[286,287,304,350,351]);
assert.equal(manifest.fonts.length,3);
for(const font of manifest.fonts){
  const original=fs.readFileSync(font.source);
  const bytes=fs.readFileSync(`dist/${font.file}`);
  assert.equal(createHash('sha256').update(original).digest('hex'),font.sourceSha256,`Fontsource changed; regenerate ${font.file}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),font.sha256,`Subset mismatch: ${font.file}`);
  assert.equal(bytes.length,font.bytes);
  assert.equal(bytes.toString('ascii',0,4),'wOF2');
  assert(bytes.length<4000,`Turkish overlay budget exceeded: ${font.file}`);
  assert(font.glyphMetricsAndOutlinesVerified);
  const license=fs.readFileSync(`dist/${font.license}`,'utf8');
  assert(license.includes('SIL OPEN FONT LICENSE Version 1.1') && license.includes('Copyright'));
  const declaration=css.slice(css.indexOf(`src:url('/${font.file}')`)).split('}')[0];
  assert(declaration.includes('unicode-range:U+011E-011F,U+0130,U+015E-015F'));
  assert(css.indexOf(`src:url('/${font.file}')`)>css.lastIndexOf('latin-ext-wght-italic.woff2'));
}
assert.equal((css.match(/latin-ext-wght-/g)||[]).length,3,'Retain complete Latin Extended fallback faces');
assert.equal((css.match(/unicode-range:U\+0100-0130,U\+0132-02BA/g)||[]).length,3,'Do not request Latin Extended for dotless i: it exists in the Latin files');
console.log('Verified Turkish glyph overlay hashes, byte budgets, OFL notices and full fallback faces.');
