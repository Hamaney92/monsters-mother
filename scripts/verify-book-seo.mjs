import fs from 'node:fs';
import assert from 'node:assert/strict';

const home=fs.readFileSync('dist/index.html','utf8');
const story=fs.readFileSync('dist/story/index.html','utf8');
assert(home.includes('<title>Illustrated Dragon Fantasy by YH | A Monster’s Mother</title>'),'Home title must describe the offer');
assert(story.includes('<title>The Book: A Cradle Made of Embers | A Monster’s Mother</title>'),'Book title must identify the book');
const scripts=[...story.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match=>JSON.parse(match[1]));
const graph=scripts.flatMap(script=>script['@graph']||[script]);
const book=graph.find(node=>node['@type']==='Book');
assert(book,'Missing Book entity');
assert.equal(book.author.name,'YH');
assert.equal(book.inLanguage,'en');
assert.equal(book.url,'https://mothersmonster.com/story/');
assert.equal(book.name,'A Monster’s Mother: A Cradle Made of Embers');
assert(story.includes(book.sameAs),'Book listing must also be visibly linked');
assert(!book.aggregateRating,'Do not invent ratings');
const breadcrumbs=graph.find(node=>node['@type']==='BreadcrumbList');
assert.equal(breadcrumbs.itemListElement.at(-1).item,book.url);
for(const question of ['What is A Monster’s Mother about?','Is this the complete book for free?','What language is the novel in?','Does the book include illustrations?']) assert(story.includes(question),`Missing reader answer: ${question}`);
for(const route of ['read/','movie/','characters/elara/','characters/ember/']) assert(story.includes(`href="/${route}"`),`Missing relevant link: ${route}`);
const preview=story.match(/<figure class="paperback-preview"[^>]*>([\s\S]*?)<\/figure>/);
assert(preview,'Book page must show a real interior preview');
assert(preview[1].includes('page 8, from Chapter Two'),'Preview must identify its actual page and chapter');
assert(preview[1].includes('loading="lazy"'),'Keep the below-fold preview lazy loaded');
assert(preview[1].includes('width="1080" height="1620"'),'Reserve the whole-page aspect ratio');
assert(preview[1].includes('image/avif') && preview[1].includes('srcset='),'Deliver responsive, modern preview images');
assert(story.includes('Contrast on printed paper can differ from a screen.'),'Do not certify physical print quality from a digital preview');
assert(!story.includes('href="/A-Monsters-Mother-Book-1-interior'),'Do not expose the full interior PDF');
const previewSource=JSON.parse(fs.readFileSync('src/data/interior-preview.json','utf8'));
assert.equal(previewSource.pdfPage,12);
assert.equal(previewSource.printedPage,8);
assert.equal(previewSource.sourcePdfSha256,'9b54a543e53ba5d8169084ea6512becc62e622de883b771690b85f809bee14e3');
const previewImage=JSON.parse(fs.readFileSync('src/data/images.json','utf8'))[previewSource.asset];
assert(previewImage,'Preview must be in the normal image delivery manifest');
assert.equal(previewImage.width,1080);
assert.equal(previewImage.height,1620);
const previewMobile=previewImage.variants.find(v=>v.width===480);
assert(previewMobile && previewMobile.avifBytes<80000 && previewMobile.webpBytes<100000,'Keep the mobile preview light');
for(const lang of ['en','fr','ar','tr']) {
  const prefix=lang==='en'?'':`${lang}/`;
  const html=fs.readFileSync(`dist/${prefix}index.html`,'utf8');
  for(const nav of ['desktop-nav','mobile-nav']) {
    const match=html.match(new RegExp(`<nav[^>]*class="${nav}"[^>]*>(.*?)</nav>`,'s'));
    assert(match?.[1].includes(`href="/${prefix}read/"`),`Missing chapter link in ${lang} ${nav}`);
  }
}
const ember=fs.readFileSync('dist/characters/ember/index.html','utf8');
assert(ember.includes('<title>Ember, Elara’s Dragon Child | A Monster’s Mother</title>'),'Ember title must identify his role');
const chapterSource=fs.readFileSync('src/content/chapters/book-one-chapter-one.md','utf8');
const evidence=chapterSource.split(/\r?\n\s*\r?\n/).find(p=>p.startsWith('Nothing had prepared her for one'));
assert(evidence && ember.includes(evidence),'Ember guide must cite the actual chapter');
for(const question of ['Is Ember Elara’s child or a dragon she finds?','What does the baby dragon look like?','Does Elara accept him immediately?','Why begin with this scene?']) assert(ember.includes(question),`Missing Ember reader answer: ${question}`);
assert(ember.includes('OPENING-CHAPTER SPOILERS ONLY'),'Make spoiler scope clear');
for(const route of ['read/','characters/elara/','blog/monstrous-motherhood/','story/']) assert(ember.includes(`href="/${route}"`),`Missing Ember reading route: ${route}`);
assert(ember.includes('free in English, without signing up'),'Do not imply a free complete book or translated chapter');
console.log('Verified book metadata, real responsive paperback preview, grounded Ember guide, reader answers and chapter navigation in four languages.');
