import fs from 'node:fs';
import assert from 'node:assert/strict';
import {verifyReaderSeo} from './lib/reader-seo.mjs';
const langs=['en','tr','fr','ar'];
const books=langs.map(lang=>JSON.parse(fs.readFileSync(`src/data/reading/${lang}.json`,'utf8')));
const original=books[0];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll("'",'&#39;').replaceAll('"','&quot;');
const route=(lang,n=0)=>`${lang==='en'?'':lang+'/'}read/book/${n?n+'/':''}`;
const sitemap=fs.readFileSync('dist/sitemap-0.xml','utf8');
const paperbackCopy={
 en:['The English paperback','138 pages with black-and-white illustrations. The paperback is a paid edition. The full book is free to read here.','See paperback details'],
 tr:['İngilizce karton kapaklı baskı','138 sayfa, siyah-beyaz iç çizimler. Basılı baskı ücretlidir. Kitabın tamamını burada ücretsiz okuyabilirsiniz.','Baskı ayrıntılarına bak'],
 fr:['L’édition brochée en anglais','138 pages et des illustrations en noir et blanc. Le broché est payant. Vous pouvez lire le roman en entier gratuitement sur ce site.','Voir les détails du broché'],
 ar:['الطبعة الورقية باللغة الإنجليزية','١٣٨ صفحة مع رسوم داخلية بالأبيض والأسود. هذه الطبعة الورقية مدفوعة. يمكنك قراءة الرواية كاملة هنا مجانًا.','اطّلع على تفاصيل الطبعة الورقية']
};
let paragraphs=0,illustrations=0,seoPages=0,paperbackOffers=0;
for(const book of books){
 assert.equal(book.chapters.length,26);assert.equal(book.author,'YH');
 const toc=fs.readFileSync(`dist/${route(book.language)}index.html`,'utf8');
 verifyReaderSeo(toc,book);seoPages++;
 assert(sitemap.includes(`https://mothersmonster.com/${route(book.language)}`));
 assert.equal((toc.match(/<li\b/g)||[]).length,26,`${book.language}: complete contents`);
 assert(!/<aside\b[^>]*class="[^\"]*\breader-paperback-offer\b/.test(toc)&&!/<a\b[^>]*data-paperback-details=/.test(toc),`${book.language}: no paperback offer in contents`);
 for(const chapter of book.chapters){
  assert.equal(chapter.paragraphs.length,original.chapters[chapter.number-1].paragraphs.length);
  const html=fs.readFileSync(`dist/${route(book.language,chapter.number)}index.html`,'utf8');
  verifyReaderSeo(html,book,chapter.number);seoPages++;
  const article=html.match(/<article[^>]*data-chapter-text[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert(article,`${book.language} ${chapter.number}: article`);
  assert(!article.includes('reader-paperback-offer')&&!article.includes('data-paperback-details='),`${book.language} ${chapter.number}: paperback offer outside narrative`);
  const offers=[...html.matchAll(/<aside\b[^>]*class="reader-paperback-offer\b[^\"]*"[^>]*>[\s\S]*?<\/aside>/g)];
  assert.equal(offers.length,chapter.number===26?1:0,`${book.language} ${chapter.number}: paperback offer only at chapter 26 end`);
  assert.equal((html.match(/data-paperback-details=/g)||[]).length,chapter.number===26?1:0,`${book.language} ${chapter.number}: single paperback CTA marker`);
  if(chapter.number===26){
   const offer=offers[0][0];
   const details=`/${book.language==='en'?'':book.language+'/'}story/#${book.language==='en'?'paperback-details':'localized-book-details'}`;
   assert(offers[0].index>html.indexOf('</article>')&&offers[0].index>html.indexOf('mailto:contact@mothersmonster.com'),`${book.language}: offer after narrative, navigation and feedback`);
   assert(/aria-labelledby="reader-paperback-heading"/.test(offer)&&/<h2\b[^>]*id="reader-paperback-heading"/.test(offer),`${book.language}: labelled paperback aside`);
   assert(offer.includes(`dir="${book.language==='ar'?'rtl':'ltr'}"`));
   for(const text of paperbackCopy[book.language])assert(offer.includes(escape(text)),`${book.language}: approved paperback copy`);
   const cta=offer.match(/<a\b[^>]*data-paperback-details="chapter_26_end"[^>]*>/)?.[0];
   assert(cta?.includes(`href="${details}"`),`${book.language}: localized paperback details route and source marker`);
   assert(!offer.includes('amazon.com'),`${book.language}: card links to details`);
   const cover=offer.match(/<img\b[^>]*>/)?.[0];
   assert(cover?.includes('optimized/cover-art-')&&cover.includes('loading="lazy"')&&cover.includes('sizes="128px"')&&/width="\d+"/.test(cover)&&/height="\d+"/.test(cover),`${book.language}: approved lazy cover with reserved dimensions`);
   paperbackOffers++;
  }
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
  assert(sitemap.includes(`https://mothersmonster.com/${route(book.language,chapter.number)}`));
  for(const n of [chapter.number-1,chapter.number+1].filter(n=>n>=1&&n<=26))assert(html.includes(`href="/${route(book.language,n)}"`));
  assert(!html.includes('googlesyndication.com/pagead'),'Do not activate ads with the reader');
 }
}
assert.equal(illustrations,40);
assert.equal(seoPages,108);
assert.equal(paperbackOffers,4);
console.log(`Verified four complete books, 104 chapters, ${paragraphs} narrative paragraphs, ${illustrations} contextual illustrations, four final-chapter paperback offers, RTL, navigation, sitemap, and canonical/robots/alternates/Book or Chapter schema on ${seoPages} reader pages.`);
