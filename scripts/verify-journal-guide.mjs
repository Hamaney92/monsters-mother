import fs from 'node:fs';
import assert from 'node:assert/strict';

const route='blog/dark-fantasy-gothic-fantasy/';
const html=fs.readFileSync(`dist/${route}index.html`,'utf8');
const nodes=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match=>{
  const value=JSON.parse(match[1]);
  return value['@graph'] || [value];
});
const article=nodes.find(node=>node['@type']==='BlogPosting');
assert(article,'Guide must have article metadata');
assert.equal(article.mainEntityOfPage,`https://mothersmonster.com/${route}`);
assert.equal(article.datePublished,'2026-09-26T00:00:00.000Z','Keep the original publication date');
assert.equal(article.dateModified,'2026-10-09T00:00:00.000Z');
assert(html.includes('Updated <time'),'Show the real update date to readers');
assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
for(const heading of ['What is dark fantasy?','What is gothic fantasy?','Does gothic fantasy always include romance?','Can a book be dark fantasy without a castle?']) {
  assert(html.includes(heading),`Missing reader question: ${heading}`);
}
for(const link of ['/story/','/read/','/characters/ember/','/blog/monstrous-motherhood/','/blog/she-gave-birth-to-a-dragon/']) {
  assert(html.includes(`href="${link}"`),`Missing useful reading link: ${link}`);
}
assert(html.includes('not a scene from our novel'),'Keep invented examples separate from book scenes');
assert(html.includes('https://www.britishlibrary.cn/en/articles/gothic-motifs/'),'Keep the literary source');
const introduction=fs.readFileSync('dist/blog/she-gave-birth-to-a-dragon/index.html','utf8');
const introductionBody=introduction.match(/<div class="prose"[^>]*>([\s\S]*?)<nav class="reading-path"/);
assert(introductionBody,'Find the article body before the existing navigation');
for(const link of ['/movie/','/story/','/characters/elara/','/characters/ember/','/characters/nessa/','/read/']) {
  assert(introductionBody[1].includes(`href="${link}"`),`Introduction must link its in-text reference: ${link}`);
}
const introductionArticle=[...introduction.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map(match=>JSON.parse(match[1])).find(node=>node['@type']==='BlogPosting');
assert.equal(introductionArticle?.datePublished,'2026-09-27T12:00:00.000Z');
assert.equal(introductionArticle?.dateModified,'2026-10-09T00:00:00.000Z');
assert(introduction.includes('Updated <time'),'Introduction must disclose its update');
assert(introductionBody[1].includes('free in English'),'Introduction must state the chapter language');
const sympathy=fs.readFileSync('dist/blog/why-we-root-for-monsters/index.html','utf8');
const sympathyBody=sympathy.match(/<div class="prose"[^>]*>([\s\S]*?)<\/div><\/article>/);
assert(sympathyBody,'Find the sympathy article before the shared book promotion');
assert(sympathyBody[1].includes('Book club questions for Chapter One'),'Offer a chapter-specific discussion section');
const discussion=sympathyBody[1].match(/<ol>([\s\S]*?)<\/ol>/);
assert(discussion,'Discussion questions must be an ordered list');
assert.equal((discussion[1].match(/<li>/g)||[]).length,5,'Keep five distinct chapter questions');
for(const link of ['/read/','/story/','/characters/ember/','/blog/monstrous-motherhood/']) {
  assert(sympathyBody[1].includes(`href="${link}"`),`Missing useful discussion link: ${link}`);
}
assert(sympathyBody[1].includes('opening scene only'),'Keep the discussion limited to the public chapter');
assert(sympathyBody[1].includes('free and needs no account'),'Do not imply a signup is required');
const chapter=fs.readFileSync('src/content/chapters/book-one-chapter-one.md','utf8');
for(const evidence of ['Its claws caught in a seam.','She had hemmed it by the window.','Her hand moved before she decided to move it.','She waited until the next one came.']) {
  assert(chapter.includes(evidence),`Discussion evidence missing from the real chapter: ${evidence}`);
}
const sympathyArticle=[...sympathy.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map(match=>JSON.parse(match[1])).find(node=>node['@type']==='BlogPosting');
assert.equal(sympathyArticle?.datePublished,'2026-09-25T00:00:00.000Z');
assert.equal(sympathyArticle?.dateModified,'2026-10-09T00:00:00.000Z');
assert(sympathy.includes('Updated <time'),'Sympathy article must disclose the update');
console.log('Verified genre guide, introduction and chapter discussion, original dates, visible updates, sources and contextual reading links.');
const motherhood=fs.readFileSync('dist/blog/monstrous-motherhood/index.html','utf8');
const motherhoodArticle=[...motherhood.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map(match=>JSON.parse(match[1])).find(node=>node['@type']==='BlogPosting');
assert.equal(motherhoodArticle?.datePublished,'2026-09-27T00:00:00.000Z');
assert.equal(motherhoodArticle?.dateModified,'2026-10-09T00:00:00.000Z');
assert(motherhood.includes('Updated <time'),'Show the substantive update date');
const careQuote=chapter.split(/\r?\n\s*\r?\n/).find(p=>p.startsWith('She could not stop watching his chest'));
assert(careQuote && motherhood.includes(careQuote),'Ground the motherhood reading in the actual chapter');
for(const heading of ['What does monstrous motherhood mean in this reading?','Elara: care before certainty','A comparison with Frankenstein: what does a creator owe?','Reading fear without excusing harm']) assert(motherhood.includes(heading),`Missing motherhood reading section: ${heading}`);
assert(motherhood.includes('https://www.gutenberg.org/cache/epub/84/pg84-images.html#chap10'),'Link the actual primary literary source');
assert(motherhood.includes('not a diagnosis') && motherhood.includes('not a claim that YH’s novel adapts'),'Keep interpretive limits clear');
for(const route of ['/read/','/characters/elara/','/characters/ember/','/story/','/blog/why-we-root-for-monsters/']) assert(motherhood.includes(`href="${route}"`),`Missing motherhood reader route: ${route}`);
console.log('Verified chapter-grounded motherhood reading, sourced literary comparison, scope disclosures and original publication date.');
const expectedReadingPaths={
  'dark-fantasy-gothic-fantasy':['monstrous-motherhood','why-we-root-for-monsters'],
  'she-gave-birth-to-a-dragon':['monstrous-motherhood','dark-fantasy-gothic-fantasy'],
  'monstrous-motherhood':['why-we-root-for-monsters','she-gave-birth-to-a-dragon'],
  'why-we-root-for-monsters':['monstrous-motherhood','she-gave-birth-to-a-dragon'],
};
for(const [id,expected] of Object.entries(expectedReadingPaths)) {
  const page=fs.readFileSync(`dist/blog/${id}/index.html`,'utf8');
  const section=page.match(/<section class="section related"[^>]*>([\s\S]*?)<\/section>/);
  assert(section,`Missing related reading section: ${id}`);
  const routes=[...section[1].matchAll(/href="\/blog\/([^"/]+)\/"/g)].map(m=>m[1]);
  assert.deepEqual(routes,expected,`Use the editorial reading path for ${id}`);
  assert.equal(new Set(routes).size,2,'Offer two distinct essays');
  assert(!routes.includes(id),'Do not recommend the current article');
  for(const target of routes) assert(fs.existsSync(`dist/blog/${target}/index.html`),'Recommend only a published page');
}
console.log('Verified four topic-specific reading paths with two distinct published essays each.');
