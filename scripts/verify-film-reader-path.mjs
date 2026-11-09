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
for(const route of ['tr/film/','tr/read/book/']) assert(discovery.includes(`href="/${route}"`),`Missing Turkish discovery destination: ${route}`);
for(const disclosure of ['Bu site Türkçe dublaj sağlamaz','26 bölümün tamamıyla Türkçe','basılı kitap İngilizcedir']) assert(discovery.includes(disclosure),`Missing truthful language disclosure: ${disclosure}`);
for(const file of ['index.html','fr/index.html','ar/index.html','tr/film/index.html','tr/read/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-or-book"'),`Homepage-only guide must not leak into ${file}`);
console.log('Verified exact chapter preview, language/access disclosure, reader destinations and Turkish film alternate.');
const invitationCopy = {
  en: {
    start: 'Read Book One free',
    excerpt: 'Read the Chapter One excerpt',
    about: 'About the illustrated book',
    caption: 'Opening line in English',
    disclosures: ['Read the complete book free in English: 26 chapters, no sign-up.', 'The paperback edition on Amazon is in English.']
  },
  fr: {
    start: 'Lire gratuitement le chapitre 1 en français',
    excerpt: 'Lire l’extrait du chapitre 1 en anglais',
    about: 'Découvrir le livre illustré',
    caption: 'Première phrase en français',
    disclosures: ['Le tome 1 complet est gratuit en français.', 'Les 26 chapitres sont accessibles sans inscription.', 'Le broché vendu sur Amazon est en anglais.']
  },
  tr: {
    start: 'Kitabı Türkçe ücretsiz oku',
    excerpt: 'İlk bölümü İngilizce oku',
    about: 'Resimli romanı keşfet',
    caption: 'Türkçe açılış cümlesi',
    disclosures: ['Birinci kitabın tamamını Türkçe ücretsiz okuyabilirsiniz: 26 bölüm, kayıt gerektirmez.', 'Amazon’daki basılı kitap İngilizcedir.']
  },
  ar: {
    start: 'اقرأ الفصل الأول مجانًا بالعربية',
    excerpt: 'اقرأ مقتطف الفصل الأول بالإنجليزية',
    about: 'اكتشف الرواية المصوّرة',
    caption: 'الجملة الافتتاحية بالعربية',
    disclosures: ['يمكنك قراءة الكتاب الأول كاملًا بالعربية مجانًا.', 'جميع فصوله الستة والعشرين متاحة دون تسجيل.', 'النسخة الورقية المباعة على Amazon باللغة الإنجليزية.']
  }
};
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#39;').replaceAll('"', '&quot;');
const attr = (attrs, name) => attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
for (const [lang, copy] of Object.entries(invitationCopy)) {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const file = lang === 'en' ? 'movie/index.html' : `${lang}/film/index.html`;
  const read = `${prefix}/read/`;
  const chapterHref = `${read}book/1/`;
  const book = `${prefix}/story/`;
  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  const arrow = lang === 'ar' ? '←' : '→';
  const localChapter = JSON.parse(fs.readFileSync(`src/data/reading/${lang}.json`, 'utf8')).chapters[0];
  const film=fs.readFileSync(`dist/${file}`,'utf8');
  const invitation=film.match(/<section class="film-book-invitation"[^>]*>([\s\S]*?)<\/section>/);
  assert(invitation,`Missing early reader invitation on ${file}`);
  assert.equal((film.match(/id="film-reader-invitation"/g)||[]).length,1);
  const quote = invitation[1].match(/<blockquote\b([^>]*)>([\s\S]*?)<\/blockquote>/);
  assert(quote, `${lang}: opening quote missing`);
  assert.equal(quote[2].trim(), escape(lang === 'en' ? opening[0] : localChapter.paragraphs[0]), `${lang}: exact published opening quote`);
  assert.equal(attr(quote[1], 'lang'), lang, `${lang}: quote language`);
  assert.equal(attr(quote[1], 'dir'), direction, `${lang}: quote direction`);
  assert.equal(attr(quote[1], 'cite'), lang === 'en' ? read : chapterHref, `${lang}: quote source`);

  const caption = invitation[1].match(/<p class="invitation-caption"[^>]*>([^<]*)<\/p>/)?.[1];
  assert.equal(caption?.trim(), escape(`${localChapter.title} · ${copy.caption}`), `${lang}: localized quote caption`);
  const note = invitation[1].match(/<p class="invitation-note"[^>]*>([^<]*)<\/p>/)?.[1];
  for (const disclosure of copy.disclosures) assert(note?.includes(escape(disclosure)), `${lang}: missing disclosure: ${disclosure}`);

  const links = [...invitation[1].matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)]
    .map(([, attrs, label]) => [attr(attrs, 'class'), attr(attrs, 'href'), label.trim()]);
  assert.deepEqual(links, [
    ['button', chapterHref, escape(`${copy.start} ${arrow}`)],
    ['text-link', read, escape(`${copy.excerpt} ${arrow}`)],
    ['text-link', book, escape(`${copy.about} ${arrow}`)]
  ], `${lang}: local chapter first, distinct English excerpt second, book information third`);
  const chapterPage = fs.readFileSync(`dist${chapterHref}index.html`, 'utf8');
  const chapterReader = chapterPage.match(/<section\b([^>]*\bdata-book-reader\b[^>]*)>/)?.[1];
  assert(chapterReader, `${lang}: destination must be the full reader`);
  assert.equal(attr(chapterReader, 'data-language'), lang, `${lang}: destination language`);
  assert.equal(attr(chapterReader, 'data-chapter'), '1', `${lang}: destination chapter`);
  assert(fs.readFileSync(`dist${read}index.html`, 'utf8').includes(escape(opening[0])), `${lang}: secondary destination must show the English excerpt`);
  assert(fs.existsSync(`dist${book}index.html`), `${lang}: book information destination must exist`);
  const playerPosition=film.indexOf('data-video-player');
  assert(playerPosition>=0 && film.indexOf(invitation[0])>playerPosition,'Keep the film player before the book invitation');
  assert(!/<iframe\b/.test(film),'Do not auto-load YouTube');
}
for(const file of ['index.html','fr/index.html','tr/read/index.html','story/index.html']) assert(!fs.readFileSync(`dist/${file}`,'utf8').includes('id="film-reader-invitation"'),'Keep this invitation scoped to film pages');
console.log('Verified early film-to-book invitation, real excerpt, translated disclosures and localized links on four film pages.');
