import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('dist/movie/index.html', 'utf8');
const chapter = fs.readFileSync('src/content/chapters/book-one-chapter-one.md', 'utf8')
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
const opening = chapter.split(/\r?\n\s*\r?\n/).slice(0, 3);
const turkishOpening=JSON.parse(fs.readFileSync('src/data/reading/tr.json','utf8')).chapters[0].paragraphs[0];
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
for(const route of ['tr/film/','tr/read/book/']) assert(discovery.includes(`href="/${route}"`),`Missing Turkish discovery destination: ${route}`);
for(const disclosure of ['Bu site Türkçe dublaj sağlamaz','26 bölümün tamamıyla Türkçe','basılı kitap İngilizcedir']) assert(discovery.includes(disclosure),`Missing truthful language disclosure: ${disclosure}`);
for(const file of ['index.html','fr/index.html','ar/index.html','tr/film/index.html','tr/read/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-or-book"'),`Homepage-only guide must not leak into ${file}`);
console.log('Verified exact chapter preview, language/access disclosure, reader destinations and Turkish film alternate.');
for(const [file,read,book,disclosures] of [
  ['movie/index.html','/read/','/story/',['Read the complete book free in English: 26 chapters, no sign-up. The paperback edition on Amazon is in English.']],
  ['fr/film/index.html','/fr/read/','/fr/story/',['en anglais','Sans inscription','pas le livre complet']],
  ['tr/film/index.html','/tr/read/','/tr/story/',['Birinci kitabın tamamını Türkçe ücretsiz okuyabilirsiniz: 26 bölüm, kayıt gerektirmez.','Amazon’daki basılı kitap İngilizcedir.']],
  ['ar/film/index.html','/ar/read/','/ar/story/',['باللغة الإنجليزية','لا يلزم التسجيل','ليس الكتاب كاملاً']],
]) {
  const film=fs.readFileSync(`dist/${file}`,'utf8');
  const invitation=film.match(/<section class="film-book-invitation"[^>]*>([\s\S]*?)<\/section>/);
  assert(invitation,`Missing early reader invitation on ${file}`);
  assert.equal((film.match(/id="film-reader-invitation"/g)||[]).length,1);
  if(file==='tr/film/index.html') {
    assert(invitation[1].includes(turkishOpening),'Use the actual Turkish opening paragraph');
    assert(/<blockquote[^>]*lang="tr"[^>]*dir="ltr"[^>]*cite="\/tr\/read\/book\/1\/"/.test(invitation[1]),'Mark and cite the Turkish chapter preview');
    assert(/<a\b[^>]*class="button"[^>]*href="\/tr\/read\/book\/1\/"[^>]*>Kitabı Türkçe ücretsiz oku →<\/a>/.test(invitation[1]),'Begin the complete Turkish book directly');
    assert(invitation[1].includes('İlk bölümü İngilizce oku'),'Keep the English excerpt option explicit');
    assert(!invitation[1].includes('kitabın tamamı değildir'),'Do not describe the complete Turkish book as an incomplete excerpt');
    assert(fs.existsSync('dist/tr/read/book/1/index.html'),'The Turkish chapter destination must exist');
  } else {
    assert(invitation[1].includes(opening[0]),'Use the actual opening paragraph, not a fabricated teaser');
    assert(/<blockquote[^>]*lang="en"[^>]*dir="ltr"/.test(invitation[1]),'Mark the excerpt as English even on RTL pages');
    if(file==='movie/index.html') {
      assert(/<a\b[^>]*class="button"[^>]*href="\/read\/book\/1\/"[^>]*>Read Book One free →<\/a>/.test(invitation[1]),'Begin the complete English book directly');
      assert(/<a\b[^>]*class="text-link"[^>]*href="\/read\/"[^>]*>Read the Chapter One excerpt →<\/a>/.test(invitation[1]),'Keep the Chapter One excerpt as a distinct secondary option');
      assert(fs.existsSync('dist/read/book/1/index.html'),'The English chapter destination must exist');
    }
  }
  for(const disclosure of disclosures) assert(invitation[1].includes(disclosure),`Missing invitation disclosure on ${file}: ${disclosure}`);
  for(const href of [read,book]) assert(invitation[1].includes(`href="${href}"`),`Missing localized invitation destination: ${href}`);
  const playerPosition=film.indexOf('data-video-player');
  assert(playerPosition>=0 && film.indexOf(invitation[0])>playerPosition,'Keep the film player before the book invitation');
  assert(!/<iframe\b/.test(film),'Do not auto-load YouTube');
}
for(const file of ['index.html','fr/index.html','tr/read/index.html','story/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-reader-invitation"'),'Keep this invitation scoped to film pages');
console.log('Verified early film-to-book invitation, real excerpt, translated disclosures and localized links on four film pages.');
