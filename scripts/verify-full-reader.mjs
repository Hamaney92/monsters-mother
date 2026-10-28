import fs from 'node:fs';
import assert from 'node:assert/strict';
const langs=['en','tr','fr','ar'];
const books=langs.map(lang=>JSON.parse(fs.readFileSync(`src/data/reading/${lang}.json`,'utf8')));
const original=books[0];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll("'",'&#39;').replaceAll('"','&quot;');
const route=(lang,n=0)=>`${lang==='en'?'':lang+'/'}read/book/${n?n+'/':''}`;
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');
let paragraphs=0,illustrations=0;
for(const book of books){
 assert.equal(book.chapters.length,26);assert.equal(book.author,'YH');
 const toc=fs.readFileSync(`dist/${route(book.language)}index.html`,'utf8');
 assert.equal((toc.match(/<li\b/g)||[]).length,26,`${book.language}: complete contents`);
 for(const chapter of book.chapters){
  assert.equal(chapter.paragraphs.length,original.chapters[chapter.number-1].paragraphs.length);
  const html=fs.readFileSync(`dist/${route(book.language,chapter.number)}index.html`,'utf8');
  const article=html.match(/<article[^>]*data-chapter-text[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert(article,`${book.language} ${chapter.number}: article`);
  let position=0;
  for(const text of chapter.paragraphs){
   if(/^[*\s-]+$/.test(text))continue;
   const at=article.indexOf(escape(text),position);
   assert(at>=position,`${book.language} ${chapter.number}: missing/reordered paragraph`);
   position=at+escape(text).length;paragraphs++;
  }
  assert.equal((article.match(/<img /g)||[]).length,chapter.illustrations.length);
  for(const image of chapter.illustrations){
   const anchor=escape(chapter.paragraphs[image.afterParagraph-1]);
   const at=article.indexOf(`<img src="/${image.src}"`);
   assert(at>article.indexOf(anchor),`${image.id}: illustration after narrative anchor`);
   const following=chapter.paragraphs[image.afterParagraph];
   if(following&&!/^[*\s-]+$/.test(following))assert(at<article.indexOf(escape(following)),`${image.id}: before next paragraph`);
   assert(fs.existsSync(`dist/${image.src}`));illustrations++;
  }
  assert(html.includes(`lang="${book.language}"`));
  if(book.language==='ar')assert(/data-chapter-text[^>]*dir="rtl"/.test(html));
  if(book.language!=='en')assert(html.includes('class="translation-note"'));
  for(const lang of langs)assert(html.includes(`hreflang="${lang}" href="https://mothersmonster.com/${route(lang,chapter.number)}"`));
  assert(sitemap.includes(`https://mothersmonster.com/${route(book.language,chapter.number)}`));
  for(const n of [chapter.number-1,chapter.number+1].filter(n=>n>=1&&n<=26))assert(html.includes(`href="/${route(book.language,n)}"`));
  assert(!html.includes('googlesyndication.com/pagead'),'Do not activate ads with the reader');
 }
}
assert.equal(illustrations,40);
console.log(`Verified four complete books, 104 chapters, ${paragraphs} narrative paragraphs, ${illustrations} contextual illustrations, RTL, navigation, alternates and sitemap.`);
