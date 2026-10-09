import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('dist/movie/index.html', 'utf8');
const chapter = fs.readFileSync('src/content/chapters/book-one-chapter-one.md', 'utf8')
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
const opening = chapter.split(/\r?\n\s*\r?\n/).slice(0, 3);
for (const paragraph of opening) assert(html.includes(paragraph), 'Film page must quote the actual chapter opening');
assert(html.includes('It is an excerpt, not the complete novel.'), 'Keep free excerpt scope clear');
assert(html.includes('in English, with no sign-up'), 'Keep reading language and access clear');
assert(html.includes('hreflang="tr" href="https://mothersmonster.com/tr/film/"'), 'Include the Turkish film alternate');
for (const route of ['read/', 'story/', 'characters/ember/', 'blog/monstrous-motherhood/']) {
  assert(html.includes(`href="/${route}"`), `Missing reader destination: ${route}`);
  assert(fs.existsSync(`dist/${route}index.html`), `Reader destination must exist: ${route}`);
}
assert(!/<iframe\b/.test(html), 'YouTube must remain click-to-load');
console.log('Verified exact chapter preview, language/access disclosure, reader destinations and Turkish film alternate.');
