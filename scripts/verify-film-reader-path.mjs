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
const turkishHome=fs.readFileSync('dist/tr/index.html','utf8');
const discovery=turkishHome.match(/<section class="section discovery-guide"[^>]*>([\s\S]*?)<\/section>/)?.[1];
assert(discovery,'Turkish homepage must distinguish film discovery from reading the book');
for(const route of ['tr/film/','tr/read/']) assert(discovery.includes(`href="/${route}"`),`Missing Turkish discovery destination: ${route}`);
for(const disclosure of ['Bu site Türkçe dublaj sağlamaz','Metin İngilizcedir','romanın Türkçe çevirisi değildir']) assert(discovery.includes(disclosure),`Missing truthful language disclosure: ${disclosure}`);
for(const file of ['index.html','fr/index.html','ar/index.html','tr/film/index.html','tr/read/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-or-book"'),`Homepage-only guide must not leak into ${file}`);
console.log('Verified exact chapter preview, language/access disclosure, reader destinations and Turkish film alternate.');
for(const [file,read,book,disclosures] of [
  ['movie/index.html','/read/','/story/',['in English','No sign-up','not the complete book']],
  ['fr/film/index.html','/fr/read/','/fr/story/',['en anglais','Sans inscription','pas le livre complet']],
  ['tr/film/index.html','/tr/read/','/tr/story/',['İngilizcedir','Kayıt gerekmez','kitabın tamamı değildir']],
  ['ar/film/index.html','/ar/read/','/ar/story/',['باللغة الإنجليزية','لا يلزم التسجيل','ليس الكتاب كاملاً']],
]) {
  const film=fs.readFileSync(`dist/${file}`,'utf8');
  const invitation=film.match(/<section class="film-book-invitation"[^>]*>([\s\S]*?)<\/section>/);
  assert(invitation,`Missing early reader invitation on ${file}`);
  assert.equal((film.match(/id="film-reader-invitation"/g)||[]).length,1);
  assert(invitation[1].includes(opening[0]),'Use the actual opening paragraph, not a fabricated teaser');
  assert(/<blockquote[^>]*lang="en"[^>]*dir="ltr"/.test(invitation[1]),'Mark the excerpt as English even on RTL pages');
  for(const disclosure of disclosures) assert(invitation[1].includes(disclosure),`Missing invitation disclosure on ${file}: ${disclosure}`);
  for(const href of [read,book]) assert(invitation[1].includes(`href="${href}"`),`Missing localized invitation destination: ${href}`);
  const playerPosition=film.indexOf('data-video-player');
  assert(playerPosition>=0 && film.indexOf(invitation[0])>playerPosition,'Keep the film player before the book invitation');
  assert(!/<iframe\b/.test(film),'Do not auto-load YouTube');
}
for(const file of ['index.html','fr/index.html','tr/read/index.html','story/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-reader-invitation"'),'Keep this invitation scoped to film pages');
console.log('Verified early film-to-book invitation, real excerpt, translated disclosures and localized links on four film pages.');
